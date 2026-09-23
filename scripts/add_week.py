#!/usr/bin/env python3
"""
Ekstraherer en ny ukes data fra en Visma-ukeplan-PDF og skriver ut et
ferdig JS-objekt, klart til å limes inn i WEEKS-arrayet i index.html.

Bruk:
    python3 scripts/add_week.py "Ukeplan uke 40.pdf"

Krever: pdfplumber (installer med: pip3 install pdfplumber)

Hva scriptet klarer helt automatisk (høy pålitelighet, bygger på
tabellstrukturen i PDF-en):
  - Ukenummer, år, datoperiode
  - Hvilken kroppsøvingsgruppe det gjelder
  - Timeplan for alle 5 dager

Hva scriptet gjør et beste-forsøk på (sjekk alltid gjennom):
  - «Ukas fokus»-fagene (splittes på Norsk:/Matematikk:/Engelsk:/Sosialt:)

Hva du fortsatt må gjøre selv (fritekst som krever en vurdering):
  - Hjemmearbeid-oppgavene
  - «Denne uken»-punktene (infoItems), inkl. hvilke som skal festes som
    standard og evt. kalenderdata (dato/klokkeslett for hendelser)
  - For disse to skriver scriptet ut både rå-teksten OG en ferdig prompt
    du kan lime rett inn i en vanlig Claude.ai-chat (ikke Claude Code) —
    se bunnen av output.
"""
import sys
import re
import json
import datetime

try:
    import pdfplumber
except ImportError:
    print("Mangler pdfplumber. Installer med: pip3 install pdfplumber")
    sys.exit(1)

# Oppdater denne ved skolestart hver høst (eller når PDF-ene bytter årstall)
SCHOOL_YEAR = 2026

FOCUS_SUBJECTS = ['Norsk', 'Matematikk', 'Engelsk', 'Sosialt']
MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli',
          'august', 'september', 'oktober', 'november', 'desember']

PROMPT_TEMPLATE = """Jeg driver en enkel ukeplan-nettside for sønnen min sin klasse. \
Under er rå-tekst hentet fra en Visma-ukeplan-PDF for uke {week}. Jeg trenger to ting \
formatert som gyldige JS-objekter, i nøyaktig dette skjemaet (bruk norske anførselstegn \
« » der originalteksten har det, behold <strong>-tagger rundt det viktigste i hvert punkt):

homework: {{
  deadlineLabel: '– leveres fredag',   // juster om fristen er en annen dag
  sectionTitle: '<kort tittel på oppgavebolken>',
  tasks: [
    {{ label: '<oppgavetekst>', sub: '<valgfri ekstra/eksempel-tekst, utelat feltet helt hvis ingen>' }}
  ]
}}

infoItems: [
  // Ett objekt per "denne uken"-punkt. defaultPinned: true KUN på punkter som er
  // spesielt tidssensitive/viktige denne uken (f.eks. et møte med konkret dato).
  // cal-feltet er valgfritt, kun for punkter med en konkret dato/klokkeslett:
  {{ id: '<kort-unik-id>', html: '<punktets tekst, kan inneholde <strong>...</strong>>' }},
  {{ id: '<id>', defaultPinned: true, html: '<tekst>',
    cal: {{ title: '<kort tittel>', location: '<sted>', start: 'ÅÅÅÅ-MM-DDTHH:MM:00', end: 'ÅÅÅÅ-MM-DDTHH:MM:00', desc: '<kort beskrivelse>' }} }}
  // ELLER for heldagshendelser: cal: {{ title, location, allDay: true, date: 'ÅÅÅÅ-MM-DD', desc }}
]

Gi meg svaret som ferdig, limbart JS — ingen forklaring rundt.

--- RÅTEKST HJEMMEARBEID ---
{homework_raw}

--- RÅTEKST "DENNE UKEN" ---
{info_raw}
"""


def extract_week_number(text):
    m = re.search(r'Uke (\d+)', text)
    return int(m.group(1)) if m else None


def week_date_range(year, week_number):
    monday = datetime.date.fromisocalendar(year, week_number, 1)
    friday = datetime.date.fromisocalendar(year, week_number, 5)
    if monday.month == friday.month:
        return "{}.–{}. {}".format(monday.day, friday.day, MONTHS[friday.month - 1])
    return "{}. {}–{}. {}".format(monday.day, MONTHS[monday.month - 1],
                                        friday.day, MONTHS[friday.month - 1])


def extract_featured_group(text):
    m = re.search(r'Kroppsøving denne uken:\s*gruppe\s+(\w+)', text, re.IGNORECASE)
    return 'Gruppe ' + m.group(1).lower() if m else None


def split_by_subjects(text, subjects):
    if not text:
        return []
    pattern = '(' + '|'.join(re.escape(s) for s in subjects) + r'):'
    parts = re.split(pattern, text)
    result = []
    for i in range(1, len(parts), 2):
        subject = parts[i]
        content = re.sub(r'\s+', ' ', parts[i + 1].strip())
        result.append((subject, content))
    return result


def merge_wrapped_lines(cell_text):
    """A subject wrapped across two PDF lines (e.g. 'Kroppsøving/' + 'norsk')
    gets rejoined into one item."""
    raw_lines = [l for l in (cell_text or '').split('\n') if l.strip()]
    items = []
    i = 0
    while i < len(raw_lines):
        line = raw_lines[i]
        if line.endswith('/') and i + 1 < len(raw_lines):
            items.append(line[:-1].rstrip() + ' / ' + raw_lines[i + 1])
            i += 2
        else:
            items.append(line)
            i += 1
    return items


def extract_schedule(pdf):
    for page in pdf.pages:
        for table in page.extract_tables():
            days_row_idx = None
            for ridx, row in enumerate(table or []):
                if row and any(c and c.strip() == 'Mandag' for c in row):
                    days_row_idx = ridx
                    break
            if days_row_idx is None:
                continue
            days_row = table[days_row_idx]
            content_row = table[days_row_idx + 1] if days_row_idx + 1 < len(table) else []
            end_row = table[days_row_idx + 2] if days_row_idx + 2 < len(table) else []
            # Column offsets between the day-name row and the content row don't
            # reliably line up (pdfplumber quirk), so match by position among
            # each row's non-empty cells instead of by raw column index.
            day_names = [c.strip() for c in days_row if c and c.strip()]
            content_blocks = [c for c in content_row if c and c.strip()]
            end_blocks = [c for c in end_row if c and c.strip()]
            days = []
            for i, day_name in enumerate(day_names):
                cell = content_blocks[i] if i < len(content_blocks) else ''
                items = merge_wrapped_lines(cell)
                end_text = ''
                end_cell = end_blocks[i] if i < len(end_blocks) else None
                if end_cell:
                    m = re.search(r'Slutt:\s*([\d:]+)', end_cell)
                    if m:
                        end_text = m.group(1)
                days.append({'day': day_name, 'items': items, 'end': end_text})
            if days:
                return days
    return []


def extract_focus_and_homework(pdf):
    for page in pdf.pages:
        for table in page.extract_tables():
            header = table[0] if table else None
            if not header or not any(c and 'Ukas fokus' in c for c in header):
                continue
            content = table[1] if len(table) > 1 else []
            # The two real text blocks are the only non-empty cells in the content
            # row (pdfplumber's column offsets don't reliably line up with the
            # header row, so we match by position among non-empty cells instead).
            blocks = [c for c in content if c and c.strip()]
            focus_text = blocks[0] if len(blocks) > 0 else ''
            homework_text = blocks[1] if len(blocks) > 1 else ''
            return focus_text, homework_text
    return '', ''


def extract_info_block(first_page_text):
    text = first_page_text
    if 'Velkommen til en ny uke' in text:
        text = text.split('Velkommen til en ny uke', 1)[1]
        text = text.split('.', 1)[1] if '.' in text[:5] else text
    if 'Kroppsøving denne uken' in text:
        text = text.split('Kroppsøving denne uken', 1)[0]
    return text.strip()


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    path = sys.argv[1]
    with pdfplumber.open(path) as pdf:
        first_page_text = pdf.pages[0].extract_text() or ''
        week_number = extract_week_number(first_page_text)
        featured_group = extract_featured_group(first_page_text)
        focus_raw, homework_raw = extract_focus_and_homework(pdf)
        schedule = extract_schedule(pdf)
        info_raw = extract_info_block(first_page_text)

    if not week_number:
        print("Fant ikke ukenummer i PDF-en — sjekk at filen er en vanlig Visma-ukeplan.")
        sys.exit(1)

    date_range = week_date_range(SCHOOL_YEAR, week_number)
    focus_parsed = split_by_subjects(focus_raw, FOCUS_SUBJECTS)

    print("=" * 70)
    print("Uke {} ({}), {} — {}".format(week_number, SCHOOL_YEAR, date_range, featured_group or '? (fant ikke gruppe)'))
    print("=" * 70)

    js = []
    js.append("    {")
    js.append("      id: '{}-W{}',".format(SCHOOL_YEAR, week_number))
    js.append("      weekNumber: {},".format(week_number))
    js.append("      year: {},".format(SCHOOL_YEAR))
    js.append("      dateRange: {},".format(js_str(date_range)))
    js.append("      featuredGroup: {},".format(js_str(featured_group or 'UKJENT')))
    js.append("      focus: [")
    if focus_parsed:
        for subject, content in focus_parsed:
            js.append("        {{ subject: {}, text: {} }},".format(js_str(subject), js_str(content)))
    else:
        js.append("        // Kunne ikke splitte automatisk — se råtekst under og skriv inn manuelt:")
        js.append("        // {}".format(js_str(focus_raw)))
    js.append("      ],")
    js.append("      homework: {")
    js.append("        // RÅTEKST — del opp i tasks: [{label, sub}] manuelt eller via chat-prompten under")
    js.append("        // " + js_str(homework_raw.replace('\n', ' ')))
    js.append("      },")
    js.append("      schedule: [")
    for day in schedule:
        items_str = ', '.join(js_str(i) for i in day['items'])
        js.append("        {{ day: '{}', items: [{}], end: '{}' }},".format(day['day'], items_str, day['end']))
    js.append("      ],")
    js.append("      infoItems: [")
    js.append("        // Se råtekst og ferdig chat-prompt lenger ned")
    js.append("      ]")
    js.append("    },")
    print("\n--- Generert JS (sjekk gjennom — spesielt homework/infoItems/focus-fallback) ---\n")
    print("\n".join(js))

    print("\n--- Rå hjemmearbeid-tekst ---\n")
    print(homework_raw)

    print("\n--- Rå \"denne uken\"-tekst ---\n")
    print(info_raw)

    print("\n--- Ferdig prompt — lim inn i en vanlig Claude.ai-chat (ikke Claude Code) ---\n")
    print(PROMPT_TEMPLATE.format(week=week_number, homework_raw=homework_raw, info_raw=info_raw))


if __name__ == '__main__':
    main()
