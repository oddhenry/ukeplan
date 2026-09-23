# Legge til en ny uke

## Arbeidsflyt: kort Claude Code-økt hver uke

Ikke klipp-og-lim mellom script, en egen Claude.ai-chat og GitHub lenger.
Gjør i stedet dette:

1. Start en **kort** Claude Code-økt i dette prosjektet.
2. Gi meg PDF-en for uken (dra den inn, eller oppgi filbanen), og si noe
   sånt som:

   > Her er PDF-en for uke 40. Sett sammen uke-objektet og legg det inn
   > i `WEEKS`-arrayet i `weeks-data.js`. Ikke commit eller push.

3. Jeg kjører `scripts/add_week.py`, fyller inn hjemmearbeid og
   «denne uken»-punktene selv (inkludert hva som bør festes og evt.
   kalenderdata), og redigerer `weeks-data.js` direkte — alt i én
   sammenhengende handling, ingen manuell sammensetting.
4. Jeg stopper **før** noe committes. Du sjekker selv (`git diff` eller
   GitHub Desktop/VS Code) at det ser riktig ut, og pusher når du er
   fornøyd — via terminal, GitHub Desktop, eller GitHubs nettgrensesnitt.

Dette holder øktene korte og billige: ingen browser-testing eller
git-operasjoner fra min side, kun datainnlegging — og du beholder full
kontroll på hva som faktisk publiseres.

## Scriptet i seg selv

```bash
pip3 install pdfplumber   # kun første gang
python3 scripts/add_week.py "Ukeplan uke 40.pdf"
```

Kan fortsatt kjøres helt på egen hånd om du vil — det skriver et
nesten ferdig JS-objekt (uketall, dato, kroppsøvingsgruppe, «Ukas
fokus» og timeplan er pålitelig automatisk uttrukket) til terminalen
og til `scripts/output/<pdf-navn>.md`. Hjemmearbeid og «denne
uken»-punktene er fortsatt rå tekst i output — det er nettopp den
biten en kort Claude Code-økt (se over) nå gjør for deg i stedet for
en egen chat.

## Når trenger du en lengre økt med meg?

- Nye funksjoner / design-endringer på selve siden
- Hvis Visma endrer PDF-oppsettet sitt og scriptet begynner å gi rart
  resultat (si fra, så retter jeg scriptet — som regel et lite fiks)
- Generelt vedlikehold
