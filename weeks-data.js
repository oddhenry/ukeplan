// ---- Data shared across all weeks (rarely changes) ----
export var SHARED = {
  school: 'Teie skole',
  grade: '3. trinn',
  contacts: [
    { role: '3A – Anne', email: 'anne.kari.augustsson@faerder.kommune.no' },
    { role: '3B – Magnus', email: 'magnus.senneset.rindaroy@faerder.kommune.no' },
    { role: '3B – Kristin', email: 'kristin.hov.holt@faerder.kommune.no' },
    { role: '3C – Emilie', email: 'emilie.skrede.beck@faerder.kommune.no' },
    { role: 'Helsesykepleier – Marit', email: 'marit.helgesen@faerder.kommune.no' }
  ],
  absenceNote: 'Fravær legges inn i Visma før kl. 08:15 hver fraværsdag. Ta kontakt i Visma eller på e-post ved behov.'
};

// ---- Per-week data. New weeks are appended here as they're received. ----
export var WEEKS = [
  {
    id: '2026-W37',
    weekNumber: 37,
    year: 2026,
    dateRange: '7.–11. september',
    featuredGroup: 'Gruppe taco',
    focus: [
      { subject: 'Norsk', text: 'Tegnsetting; punktum, spørretegn og utropstegn' },
      { subject: 'Matematikk', text: 'Sifrenes verdi' },
      { subject: 'Engelsk', text: 'Jeg kan kjenne igjen og vite hvilke former circle, square, triangle og rectangle er.' },
      { subject: 'Sosialt', text: 'Nysgjerrighet. Evne til å vise interesse for alt som foregår. Se en sak fra flere sider, eksperimentere og finne ut hvordan ting fungerer.' }
    ],
    homework: {
      deadlineLabel: '– leveres fredag',
      sectionTitle: 'Lesing og skriving',
      tasks: [
        { label: 'Les 15 minutter i egen bok/lesehefte hver dag.' },
        { label: 'Skrivelekse i Salto arbeidsbok s. 20 og 21.', sub: 'Oppgave 7 på s. 21 er ekstra.' },
        { label: 'Matematikk: jobb i 10 minutter på s. 24–25 i Matematikk 3A.' }
      ]
    },
    schedule: [
      { day: 'Mandag', items: ['Lesekvart','Norsk','Korps','Matematikk'], end: '13:30' },
      { day: 'Tirsdag', items: ['Uteskole','Kor'], end: '13:00' },
      { day: 'Onsdag', items: ['Lesekvart','Engelsk','Samfunnsfag / SMART','Norsk (bibliotek)'], end: '13:30' },
      { day: 'Torsdag', items: ['Lesekvart','Kroppsøving / norsk','KRLE'], end: '13:30' },
      { day: 'Fredag', items: ['Lesekvart','Kunst & håndverk','Norsk','Matematikk'], end: '13:30' }
    ],
    infoItems: [
      { id: 'forrigeuke', html: 'Forrige uke fikk vi lære om og prøve klarinett, tverrfløyte og saksofon, var på tur til utsikten, skrev og tegnet til kong Harald, og lekte på den nye lekeplassen. Vi har også jobbet med setninger, høye tall, tall på engelsk og hvordan være en god venn og klassekamerat.' },
      { id: 'kastballen', html: 'Vi er med på «Kast ballen» de neste ukene. Lek med ball står i fokus, gjennom tema som ballbehandling, kast og mottak, skudd og forskjellige spill med håndball.' },
      { id: 'sekken', html: 'Når vi sender hjem bøker, er det viktig at disse <strong>blir liggende i sekken</strong> hver dag – de brukes også på skolen i løpet av uken.' },
      { id: 'skriveregler', html: 'Når barna gjør skriveleksene, er det viktig å følge opp at de <strong>bruker små bokstaver og skriver hele setninger</strong> – stor bokstav først i setningen, bokstavene på linjen og med mellomrom, og riktig tegnsetting.' },
      { id: 'foreldremote', defaultPinned: true, html: 'Foreldremøte torsdag 24.09, kl. 17.00 i aulaen',
        cal: { title: 'Foreldremøte – 3. trinn', location: 'Aulaen, Teie skole', start: '2026-09-24T17:00:00', end: '2026-09-24T18:00:00', desc: 'Foreldremøte for 3. trinn.' } }
    ]
  },
  {
    id: '2026-W38',
    weekNumber: 38,
    year: 2026,
    dateRange: '14.–18. september',
    featuredGroup: 'Gruppe pizza',
    focus: [
      { subject: 'Norsk', text: 'Tegnsetting: punktum, spørretegn og utropstegn' },
      { subject: 'Matematikk', text: 'Hoderegning' },
      { subject: 'Engelsk', text: 'Jeg kan kjenne igjen, si og skrive navnene på noen vanlige former på norsk og engelsk.', example: 'circle (sirkel) · rectangle (rektangel) · oval (oval) · square (kvadrat) · triangle (trekant)' },
      { subject: 'Sosialt', text: 'Nysgjerrighet. Evne til å vise interesse for alt som foregår. Se en sak fra flere sider, eksperimentere og finne ut hvordan ting fungerer.' }
    ],
    homework: {
      deadlineLabel: '– leveres fredag',
      sectionTitle: 'Lesing og skriving',
      tasks: [
        { label: 'Denne uken er det lesebingo som lekse. Ark sendes hjem i permen på mandag. Husk å lese litt hver dag.' },
        { label: 'Matematikk: jobb i minst 10 minutter på s. 30–31 i Matematikk 3A.' },
        { label: 'Engelsk: finn en ting hjemme som har hver av disse formene: circle, rectangle, oval, square, triangle, og skriv eller fortell hva det er i lekseboken din.', sub: 'F.eks. Clock – circle, Door – rectangle, Pizza slice – triangle.' }
      ]
    },
    schedule: [
      { day: 'Mandag', items: ['Lesekvart','Fellessamling','Norsk','Korps','Matematikk'], end: '13:30' },
      { day: 'Tirsdag', items: ['Uteskole','Fellessamling'], end: '13:00' },
      { day: 'Onsdag', items: ['Lesekvart','Engelsk','Samfunnsfag / SMART','Norsk (bibliotek)'], end: '13:30' },
      { day: 'Torsdag', items: ['Lesekvart','Kroppsøving / norsk','KRLE'], end: '13:30' },
      { day: 'Fredag', items: ['Lesekvart','Arbeidsøkt','Aktivitetsdag'], end: '13:30' }
    ],
    infoItems: [
      { id: 'trivselsuke', defaultPinned: true, html: 'Denne uken er det <strong>trivselsuke</strong> på Teie skole! Mandag: Crazy Hair Day for hele skolen. Tirsdag: tur med bål – ta gjerne med vedkubbe og enkel bålmat. Torsdag: pysjdag – ha på pysjamas og ta med bamse (må få plass i sekken). Fredag: aktivitetsdag med stasjoner og pølser – husk matpakke også.' },
      { id: 'kastballen', html: 'Vi er med på «Kast ballen» de neste ukene. Lek med ball står i fokus, gjennom tema som ballbehandling, kast og mottak, skudd og forskjellige spill med håndball.' },
      { id: 'sekken', html: 'Når vi sender hjem bøker og læringsbrett, er det viktig at disse <strong>blir liggende i sekken</strong> hver dag da de også brukes på skolen i løpet av uken.' },
      { id: 'foreldremote', defaultPinned: true, html: 'Foreldremøte torsdag 24.09, kl. 17.00 i aulaen',
        cal: { title: 'Foreldremøte – 3. trinn', location: 'Aulaen, Teie skole', start: '2026-09-24T17:00:00', end: '2026-09-24T18:00:00', desc: 'Foreldremøte for 3. trinn.' } }
    ]
  },
  {
    id: '2026-W39',
    weekNumber: 39,
    year: 2026,
    dateRange: '21.–25. september',
    featuredGroup: 'Gruppe taco',
    focus: [
      { subject: 'Norsk', text: 'Ordklasser: substantiv' },
      { subject: 'Matematikk', text: 'Hoderegning' },
      { subject: 'Engelsk', text: 'Kjenne igjen, si og skrive navn på noen vanlige former på norsk og engelsk.', example: 'circle (sirkel) · rectangle (rektangel) · oval (oval) · square (kvadrat) · triangle (trekant)' },
      { subject: 'Sosialt', text: 'Nysgjerrighet – vise interesse for det som skjer, se en sak fra flere sider, eksperimentere og finne ut hvordan ting fungerer.' }
    ],
    homework: {
      deadlineLabel: '– leveres fredag',
      sectionTitle: 'Lesing og skriving',
      tasks: [
        { label: 'Salto elevbok 3a/3b: les s. 25 og/eller 26', sub: 'Ekstra: les «Billetten» på s. 27 med en voksen' },
        { label: 'Salto elevbok 3c: les s. 33 og/eller 34', sub: 'Ekstra: les «Billetten» på s. 35 med en voksen' },
        { label: 'Lær hva ordene nederst på sidene betyr' },
        { label: 'Matematikk: jobb minst 15 minutter med uferdig arbeid fra Matematikk 3A, s. 8–35' }
      ]
    },
    schedule: [
      { day: 'Mandag', items: ['Lesekvart','Norsk','Korps','Matematikk'], end: '13:30' },
      { day: 'Tirsdag', items: ['Uteskole','Kor'], end: '13:00' },
      { day: 'Onsdag', items: ['Lesekvart','Fotografering','Engelsk','Arbeidsplan','Norsk (bibliotek)'], end: '13:30' },
      { day: 'Torsdag', items: ['Lesekvart','Kroppsøving / norsk','Lek'], end: '13:30' },
      { day: 'Fredag', items: ['Lesekvart','Norsk','Matematikk','K&H'], end: '13:30' }
    ],
    infoItems: [
      { id: 'trivselsuke', html: 'Forrige uke hadde vi trivselsuke: fellesvegg i aulaen, «crazy hair day», pysj- og bamsedag, og felles aktivitetsdag. De som hadde norsk på torsdag fikk brev fra sin nye brevvenn på Oserød skole. Resten av trinnet får brevet sitt <strong>nå på torsdag</strong> og skal svare på det.' },
      { id: 'fotograf', html: '<strong>Onsdag kommer fotografen</strong> – det tas trinnbilde og portrettbilder til skolekatalogen.',
        cal: { title: 'Skolefotografering – 3. trinn', location: 'Teie skole', allDay: true, date: '2026-09-23', desc: 'Trinnbilde og portrettbilder til skolekatalogen.' } },
      { id: 'kastballen', html: 'De neste ukene har vi «Kast ballen»: ballbehandling, kast og mottak, skudd og ulike ballspill med håndball.' },
      { id: 'sekken', html: 'Bøker og lærebrett som sendes hjem må <strong>bli liggende i sekken</strong> hver dag – de brukes også på skolen.' },
      { id: 'foreldremote', defaultPinned: true, html: 'Foreldremøte torsdag 24.09, kl. 17.00 i aulaen',
        cal: { title: 'Foreldremøte – 3. trinn', location: 'Aulaen, Teie skole', start: '2026-09-24T17:00:00', end: '2026-09-24T18:00:00', desc: 'Foreldremøte for 3. trinn.' } }
    ]
  }
];
