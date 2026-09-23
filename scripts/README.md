# Legge til en ny uke

Arbeidsflyt for å oppdatere nettsiden med en ny ukeplan, uten å måtte
gjennom en full Claude Code-økt hver gang.

## 1. Kjør scriptet

```bash
pip3 install pdfplumber   # kun første gang
python3 scripts/add_week.py "Ukeplan uke 40.pdf"
```

Scriptet skriver ut:
- Et nesten ferdig JS-objekt (uketall, år, dato, kroppsøvingsgruppe,
  «Ukas fokus» og timeplan — disse er pålitelig automatisk uttrukket
  fra PDF-ens tabellstruktur).
- Rå tekst for hjemmearbeid og «Denne uken»-punktene, som fortsatt
  krever en vurdering (hva skal festes, kalenderdata for konkrete
  hendelser osv.).
- En ferdig utformet prompt du kan lime rett inn i en **vanlig
  Claude.ai-chat** (ikke Claude Code) for å få de to siste bitene
  formatert riktig.

## 2. Sett sammen det ferdige uke-objektet

Ta JS-objektet scriptet ga deg, fyll inn `homework` og `infoItems` fra
chat-svaret, og fjern kommentarene.

## 3. Lim inn på GitHub — ingen lokal git nødvendig

1. Gå til [github.com/oddhenry/ukeplan/edit/main/index.html](https://github.com/oddhenry/ukeplan/edit/main/index.html)
   (åpner filen direkte i GitHubs nettbaserte redigering)
2. Finn `WEEKS`-arrayet, lim inn det nye uke-objektet som et nytt
   element (rekkefølgen i arrayet spiller ingen rolle — sortering skjer
   automatisk basert på `year`/`weekNumber`)
3. Scroll ned → **Commit changes...** → **Commit directly to the `main` branch**

GitHub Pages bygger automatisk om siden i løpet av 1–2 minutter.

## Når trenger du meg (Claude Code) igjen?

- Nye funksjoner / design-endringer på selve siden
- Hvis Visma endrer PDF-oppsettet sitt og scriptet begynner å gi rart
  resultat (si fra, så retter jeg scriptet — som regel et lite fiks)
- Generelt vedlikehold

Selve den ukentlige data-inntastingen skal ikke lenger kreve meg.
