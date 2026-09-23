# Ukeplan

En enkel, selvstendig nettside som viser ukeplanen for 3. trinn ved Teie skole.
Bygget med vanlig HTML/CSS/JavaScript — ingen rammeverk, ingen byggeprosess.

- `index.html` — markup
- `styles.css` — design
- `app.js` — logikk
- `weeks-data.js` — selve ukedataene (det du redigerer når en ny uke legges til)

**Funksjoner:**
- Bla mellom uker (piler i header)
- Fest/løsne punkter du vil ha øverst — synkroniseres på tvers av enheter
- Legg hendelser rett i kalenderen (📅-ikonet)
- Lys/mørk modus følger systeminnstillingen

Live: https://oddhenry.github.io/ukeplan/

## Kjøre lokalt

`app.js` og `weeks-data.js` er JavaScript-moduler, som nettlesere av
sikkerhetshensyn **ikke** kjører fra en fil åpnet direkte (dobbeltklikk).
Siden må derfor kjøres fra en ekte adresse, selv bare for å se den lokalt:

```bash
python3 -m http.server 8000
```

Åpne deretter `http://localhost:8000` i nettleseren.

(Live-siden på GitHub Pages er upåvirket av dette — den serveres allerede
over en ekte adresse.)

## Legge til en ny uke

Se [`scripts/README.md`](scripts/README.md) for full arbeidsflyt.

Kort fortalt: legg PDF-en fra Visma i `raw pdf/`, gi den til en kort Claude
Code-økt, sjekk endringen i `weeks-data.js` med `git diff`, og push selv.

## Deploy

Siden ligger på [GitHub Pages](https://oddhenry.github.io/ukeplan/) og bygges
automatisk på nytt hver gang noe pushes til `main` — ingen egen deploy-kommando
nødvendig.
