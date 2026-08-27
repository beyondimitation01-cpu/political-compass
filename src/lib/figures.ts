export type TimelineEvent = {
  year: string;
  title: string;
  detail: string;
};

export type Figure = {
  slug: string;
  name: string;
  initials: string;
  title: string;
  country: string;
  countryCode: string;
  born: string;
  died: string | null;
  party: string;
  era: "19th Century" | "20th Century" | "Contemporary";
  region: "Africa" | "Americas" | "Asia" | "Europe" | "Oceania";
  summary: string;
  bio: string[];
  offices: string[];
  timeline: TimelineEvent[];
};

export const figures: Figure[] = [
  {
    slug: "nelson-mandela",
    name: "Nelson Mandela",
    initials: "NM",
    title: "Anti-apartheid leader, President of South Africa",
    country: "South Africa",
    countryCode: "ZA",
    born: "18 July 1918",
    died: "5 December 2013",
    party: "African National Congress",
    era: "20th Century",
    region: "Africa",
    summary:
      "Lawyer and liberation leader who spent 27 years imprisoned for opposing apartheid, then led South Africa's transition to multiracial democracy and became its first Black president.",
    bio: [
      "Born into the Thembu royal family in Mvezo, Mandela studied law and helped found South Africa's first Black-run law firm. He joined the African National Congress (ANC) in 1944 and rose through its Youth League, embracing nonviolent protest before turning to armed struggle after the 1960 Sharpeville massacre.",
      "In 1964 he was sentenced to life imprisonment at the Rivonia Trial. His 27 years of incarceration, mostly on Robben Island, made him the global face of the anti-apartheid movement. As international pressure mounted, the apartheid government entered secret talks with him.",
      "Released in 1990, Mandela negotiated the end of white minority rule with President F. W. de Klerk — work that earned both men the 1993 Nobel Peace Prize. Elected president in 1994, he served a single term devoted to reconciliation rather than retribution, establishing the Truth and Reconciliation Commission before retiring in 1999.",
    ],
    offices: [
      "President of South Africa (1994–1999)",
      "President of the African National Congress (1991–1997)",
      "Robben Island prisoner (1964–1982)",
    ],
    timeline: [
      {
        year: "1944",
        title: "Joins the African National Congress",
        detail: "Co-founds the ANC Youth League, pushing the movement toward mass activism.",
      },
      {
        year: "1964",
        title: "Rivonia Trial sentence",
        detail: "Condemned to life imprisonment for sabotage and conspiracy to overthrow the state.",
      },
      {
        year: "1990",
        title: "Released from prison",
        detail: "Walks free after 27 years alongside growing international sanctions on apartheid.",
      },
      {
        year: "1994",
        title: "Elected president",
        detail: "Wins South Africa's first universal elections, leading a Government of National Unity.",
      },
    ],
  },
  {
    slug: "angela-merkel",
    name: "Angela Merkel",
    initials: "AM",
    title: "Chancellor of Germany",
    country: "Germany",
    countryCode: "DE",
    born: "17 July 1954",
    died: null,
    party: "Christian Democratic Union",
    era: "Contemporary",
    region: "Europe",
    summary:
      "Quantum chemist turned stateswoman who served as Germany's chancellor for 16 years, guiding Europe through the eurozone crisis, migration debate, and the early pandemic.",
    bio: [
      "Raised in East Germany, Merkel earned a doctorate in quantum chemistry and worked as a research scientist before entering politics during the 1989 democratic transition. She joined the Christian Democratic Union (CDU) and was elected to the Bundestag in 1990.",
      "Helmut Kohl promoted her rapidly, and she became Germany's first female cabinet minister in 1991. After breaking with Kohl amid a party finance scandal, she won the CDU leadership in 2000 and the chancellorship in 2005 — the first woman and first East German to hold the post.",
      "Across four terms she became the de facto leader of the European Union, navigating the 2008 financial crisis, the Greek debt standoff, the 2015 refugee influx, and the Brexit negotiations. She chose not to seek a fifth term and left office in December 2021.",
    ],
    offices: [
      "Chancellor of Germany (2005–2021)",
      "Leader of the CDU (2000–2018)",
      "Federal Minister for the Environment (1994–1998)",
    ],
    timeline: [
      {
        year: "1989",
        title: "Enters politics",
        detail: "Joins the new Democratic Awakening party as East Germany opens to democracy.",
      },
      {
        year: "2005",
        title: "Becomes Chancellor",
        detail: "Leads a grand coalition after a narrow victory, the first woman in the role.",
      },
      {
        year: "2015",
        title: "Refugee policy",
        detail: "Opens Germany's borders to Syrian refugees, reshaping the EU migration debate.",
      },
      {
        year: "2021",
        title: "Leaves office",
        detail: "Steps down after 16 years, the longest-serving post-war chancellor besides Kohl.",
      },
    ],
  },
  {
    slug: "winston-churchill",
    name: "Winston Churchill",
    initials: "WC",
    title: "Prime Minister of the United Kingdom",
    country: "United Kingdom",
    countryCode: "GB",
    born: "30 November 1874",
    died: "24 January 1965",
    party: "Conservative",
    era: "20th Century",
    region: "Europe",
    summary:
      "Soldier, journalist, and wartime prime minister whose defiant oratory rallied Britain through the Second World War and helped define the post-war Western order.",
    bio: [
      "Born at Blenheim Palace into an aristocratic family, Churchill began his career as a cavalry officer and war correspondent, seeing action in Cuba, India, Sudan, and South Africa before entering Parliament in 1900.",
      "He held senior offices — Home Secretary, First Lord of the Admiralty, Chancellor — but fell from favor after the 1915 Gallipoli disaster. A decade in the political wilderness ended as his warnings about Nazi Germany proved prescient.",
      "Becoming prime minister in May 1940, he refused to negotiate with Hitler and galvanized the nation through speeches such as \"We shall fight on the beaches.\" Voted out in 1945, he returned as prime minister (1951–1955), coined the term \"Iron Curtain,\" and received the 1953 Nobel Prize in Literature.",
    ],
    offices: [
      "Prime Minister (1940–1945, 1951–1955)",
      "First Lord of the Admiralty (1939–1940)",
      "Chancellor of the Exchequer (1924–1929)",
    ],
    timeline: [
      {
        year: "1900",
        title: "Elected to Parliament",
        detail: "Enters the Commons as a Conservative MP after switching from the Liberals and back.",
      },
      {
        year: "1940",
        title: "Wartime prime minister",
        detail: "Takes office as France falls and refuses French capitulation, rallying Britain alone.",
      },
      {
        year: "1946",
        title: "Iron Curtain speech",
        detail: "Warns of Soviet expansion in Fulton, Missouri, framing the Cold War for the West.",
      },
      {
        year: "1953",
        title: "Nobel Prize in Literature",
        detail: "Honored for his mastery of historical and biographical description and oratory.",
      },
    ],
  },
  {
    slug: "lee-kuan-yew",
    name: "Lee Kuan Yew",
    initials: "LK",
    title: "Founding Prime Minister of Singapore",
    country: "Singapore",
    countryCode: "SG",
    born: "16 September 1923",
    died: "23 March 2015",
    party: "People's Action Party",
    era: "20th Century",
    region: "Asia",
    summary:
      "Founder of modern Singapore who transformed a resource-poor port into a prosperous, disciplined city-state over three decades as prime minister.",
    bio: [
      "Born Lee Kuan Yew to a wealthy Straits Chinese family, he read law at Cambridge and returned to Singapore to practice as a barrister. In 1954 he co-founded the People's Action Party (PAP), campaigning for an end to British colonial rule.",
      "He became Singapore's first prime minister in 1959 and led the island into a brief merger with Malaysia in 1963. When the union collapsed in 1965, he announced Singapore's separation on television, weeping on air at the prospect of governing a tiny, insecure nation.",
      "Over the following decades he oversaw rapid industrialization, public housing for most citizens, strict anti-corruption enforcement, and bilingual education. He stepped down in 1990 but remained a senior minister and an influential adviser until his death.",
    ],
    offices: [
      "Prime Minister (1959–1990)",
      "Senior Minister (1990–2004)",
      "Minister Mentor (2004–2011)",
    ],
    timeline: [
      {
        year: "1954",
        title: "Founds the PAP",
        detail: "Forms the People's Action Party with trade unionists and English-educated professionals.",
      },
      {
        year: "1959",
        title: "Self-government",
        detail: "Becomes prime minister as Singapore gains full internal self-rule from Britain.",
      },
      {
        year: "1965",
        title: "Independence",
        detail: "Leads Singapore into independence after separation from Malaysia.",
      },
      {
        year: "1990",
        title: "Steps down",
        detail: "Hands power to Goh Chok Tong after 31 years as prime minister.",
      },
    ],
  },
  {
    slug: "abraham-lincoln",
    name: "Abraham Lincoln",
    initials: "AL",
    title: "16th President of the United States",
    country: "United States",
    countryCode: "US",
    born: "12 February 1809",
    died: "15 April 1865",
    party: "Republican",
    era: "19th Century",
    region: "Americas",
    summary:
      "Self-educated frontier lawyer who preserved the Union through the Civil War and issued the Emancipation Proclamation, ending slavery in the rebellious states.",
    bio: [
      "Born in a one-room Kentucky log cabin and largely self-educated, Lincoln taught himself law and was admitted to the Illinois bar in 1836. He served four terms in the Illinois legislature and one term in the U.S. House of Representatives.",
      "His opposition to the spread of slavery into western territories, articulated in the 1858 Lincoln–Douglas debates, propelled him to the 1860 Republican presidential nomination. His election prompted eleven Southern states to secede and form the Confederacy.",
      "As president he led the Union through four years of civil war, eventually issuing the Emancipation Proclamation on 1 January 1863 and pressing for the Thirteenth Amendment. Days after the Confederate surrender at Appomattox, he was assassinated at Ford's Theatre.",
    ],
    offices: [
      "President of the United States (1861–1865)",
      "U.S. Representative, Illinois (1847–1849)",
      "Member, Illinois House of Representatives (1834–1842)",
    ],
    timeline: [
      {
        year: "1836",
        title: "Admitted to the bar",
        detail: "Begins a law practice in Springfield, Illinois after teaching himself the law.",
      },
      {
        year: "1860",
        title: "Elected president",
        detail: "Wins the presidency on a platform opposing slavery's expansion into new territories.",
      },
      {
        year: "1863",
        title: "Emancipation Proclamation",
        detail: "Declares freedom for enslaved people in the rebelling states, reframing the war.",
      },
      {
        year: "1865",
        title: "Assassination",
        detail: "Shot at Ford's Theatre, dying the next morning as the Civil War effectively ends.",
      },
    ],
  },
  {
    slug: "margaret-thatcher",
    name: "Margaret Thatcher",
    initials: "MT",
    title: "Prime Minister of the United Kingdom",
    country: "United Kingdom",
    countryCode: "GB",
    born: "13 October 1925",
    died: "8 April 2013",
    party: "Conservative",
    era: "20th Century",
    region: "Europe",
    summary:
      "Britain's first female prime minister, who reshaped the economy around free markets, privatization, and a reduced state across the 1980s.",
    bio: [
      "The daughter of a Lincolnshire grocer, Thatcher trained as a chemist and barrister before entering Parliament in 1959. She rose through Conservative ranks to defeat Edward Heath for the party leadership in 1975.",
      "Elected prime minister in 1979, she pursued deregulation, privatization of state industries, and confrontations with trade union power. The 1982 Falklands War restored her popularity and she won two further terms.",
      "Her close alignment with U.S. President Ronald Reagan and her anti-Communist stance defined the decade. Forced from office by her own party in 1990 over the poll tax and European policy, she remained an influential ideological figure until her death.",
    ],
    offices: [
      "Prime Minister (1979–1990)",
      "Leader of the Conservative Party (1975–1990)",
      "Secretary of State for Education (1970–1974)",
    ],
    timeline: [
      {
        year: "1959",
        title: "Enters Parliament",
        detail: "Elected MP for Finchley, beginning a 33-year Commons career.",
      },
      {
        year: "1975",
        title: "Party leader",
        detail: "Defeats Edward Heath to lead the Conservatives from opposition.",
      },
      {
        year: "1979",
        title: "Becomes Prime Minister",
        detail: "Wins on the back of the Winter of Discontent; first woman to hold the office.",
      },
      {
        year: "1990",
        title: "Resigns",
        detail: "Steps down after a leadership challenge triggered by the poll tax backlash.",
      },
    ],
  },
  {
    slug: "indira-gandhi",
    name: "Indira Gandhi",
    initials: "IG",
    title: "Prime Minister of India",
    country: "India",
    countryCode: "IN",
    born: "19 November 1917",
    died: "31 October 1984",
    party: "Indian National Congress",
    era: "20th Century",
    region: "Asia",
    summary:
      "India's only female prime minister, who centralized power, led the country to victory in 1971, and imposed a controversial two-year state of emergency.",
    bio: [
      "The only child of India's first prime minister, Jawaharlal Nehru, Indira Gandhi grew up immersed in the independence movement. She served as her father's unofficial chief of staff before succeeding Lal Bahadur Shastri as prime minister in 1966.",
      "Initially seen as a pliable consensus figure, she consolidated control, nationalized banks, and won a landslide in 1971 — the same year she oversaw the war that created Bangladesh. She also pushed the nuclear program to a \"peaceful\" detonation in 1974.",
      "After courts voided her 1975 election, she declared a national Emergency, suspending civil liberties for 21 months. Defeated in 1977, she returned to power in 1980. She was assassinated by her own Sikh bodyguards in 1984 after ordering the storming of the Golden Temple.",
    ],
    offices: [
      "Prime Minister (1966–1977, 1980–1984)",
      "Minister of Information and Broadcasting (1964–1966)",
      "President of the Indian National Congress (1959, 1978–1984)",
    ],
    timeline: [
      {
        year: "1966",
        title: "Becomes Prime Minister",
        detail: "Succeeds Shastri after his death, chosen as a compromise leader by party bosses.",
      },
      {
        year: "1971",
        title: "Bangladesh war",
        detail: "Leads India to victory over Pakistan, overseeing the creation of Bangladesh.",
      },
      {
        year: "1975",
        title: "Declares the Emergency",
        detail: "Suspends civil liberties for 21 months after a court voids her election.",
      },
      {
        year: "1984",
        title: "Assassination",
        detail: "Killed by her Sikh bodyguards following Operation Blue Star at the Golden Temple.",
      },
    ],
  },
  {
    slug: "kwame-nkrumah",
    name: "Kwame Nkrumah",
    initials: "KN",
    title: "Founding President of Ghana",
    country: "Ghana",
    countryCode: "GH",
    born: "21 September 1909",
    died: "27 April 1972",
    party: "Convention People's Party",
    era: "20th Century",
    region: "Africa",
    summary:
      "Pan-Africanist who led the Gold Coast to independence as Ghana in 1957 and became a leading voice for African unity before being overthrown.",
    bio: [
      "Born in Nkroful, Gold Coast, Nkrumah studied in the United States and Britain, where he absorbed pan-Africanist ideas. He returned home in 1947 and founded the Convention People's Party, organizing mass strikes and \"Positive Action\" campaigns.",
      "He became Prime Minister of the Gold Coast in 1952 and led it to independence as Ghana in 1957 — the first sub-Saharan colony to win self-rule. He declared a republic in 1960 and became its first president.",
      "His vision of a united, socialist Africa produced the Organization of African Unity in 1963, but growing authoritarianism and economic trouble eroded support. While on a state visit to China in 1966, he was deposed in a military coup and died in exile in Bucharest.",
    ],
    offices: [
      "President of Ghana (1960–1966)",
      "Prime Minister (1957–1960)",
      "Prime Minister of the Gold Coast (1952–1957)",
    ],
    timeline: [
      {
        year: "1949",
        title: "Founds the CPP",
        detail: "Establishes the Convention People's Party demanding immediate self-government.",
      },
      {
        year: "1957",
        title: "Ghana independence",
        detail: "Leads the Gold Coast to independence, the first sub-Saharan colony to do so.",
      },
      {
        year: "1963",
        title: "Organization of African Unity",
        detail: "Hosts the founding summit of the OAU in Addis Ababa, championing continental unity.",
      },
      {
        year: "1966",
        title: "Overthrown",
        detail: "Deposed by a military coup while abroad; goes into exile in Guinea.",
      },
    ],
  },
  {
    slug: "golda-meir",
    name: "Golda Meir",
    initials: "GM",
    title: "Prime Minister of Israel",
    country: "Israel",
    countryCode: "IL",
    born: "3 May 1898",
    died: "8 December 1978",
    party: "Mapai (Labour)",
    era: "20th Century",
    region: "Asia",
    summary:
      "One of the world's first female heads of government, who led Israel during the Yom Kippur War after a lifetime building the state.",
    bio: [
      "Born Golda Mabovitch in Kyiv and raised in Milwaukee, Wisconsin, Meir emigrated to British Palestine in 1921 and joined a kibbutz. She rose through the trade union movement and the Mapai party, becoming a central figure in pre-state Zionist politics.",
      "She signed Israel's Declaration of Independence in 1948 and served as ambassador to the Soviet Union, Labour Minister, and Foreign Minister — meeting heads of state and raising funds from diaspora communities.",
      "She became prime minister in 1969. Her tenure was dominated by the 1973 Yom Kippur War, whose early intelligence failures prompted public criticism. She resigned in 1974 and died of lymphoma four years later.",
    ],
    offices: [
      "Prime Minister of Israel (1969–1974)",
      "Minister of Foreign Affairs (1956–1966)",
      "Minister of Labour (1949–1956)",
    ],
    timeline: [
      {
        year: "1921",
        title: "Emigrates to Palestine",
        detail: "Leaves the United States for British Mandate Palestine, joining Kibbutz Merhavia.",
      },
      {
        year: "1948",
        title: "Signs Declaration of Independence",
        detail: "One of 24 signatories of Israel's founding document; soon sent as envoy to Moscow.",
      },
      {
        year: "1969",
        title: "Becomes Prime Minister",
        detail: "Takes office after Levi Eshkol's death, the world's third female head of government.",
      },
      {
        year: "1973",
        title: "Yom Kippur War",
        detail: "Leads Israel through the surprise Arab attack; resigns the following year.",
      },
    ],
  },
  {
    slug: "vaclav-havel",
    name: "Václav Havel",
    initials: "VH",
    title: "President of Czechoslovakia and the Czech Republic",
    country: "Czech Republic",
    countryCode: "CZ",
    born: "5 October 1936",
    died: "18 December 2011",
    party: "Independent",
    era: "Contemporary",
    region: "Europe",
    summary:
      "Playwright and dissident who became the last president of Czechoslovakia and the first of the Czech Republic after leading the Velvet Revolution.",
    bio: [
      "Born into a bourgeois Prague family stigmatized under communism, Havel was barred from formal higher education and trained as a stagehand. He became a leading absurdist playwright, with works like \"The Garden Party\" and \"The Memorandum\" produced across Europe.",
      "After the 1968 Warsaw Pact invasion crushed the Prague Spring, Havel was banned from the theatre and turned to political essay, writing \"The Power of the Powerless\" and co-authoring Charter 77, which documented human-rights abuses.",
      "Repeatedly imprisoned, he became a symbol of the dissident movement. During the 1989 Velvet Revolution he led the Civic Forum to power and was elected president within weeks. He oversaw Czechoslovakia's transition and, after the 1993 split, served as the first Czech president until 2003.",
    ],
    offices: [
      "President of the Czech Republic (1993–2003)",
      "President of Czechoslovakia (1989–1992)",
      "Co-founder, Charter 77 (1977)",
    ],
    timeline: [
      {
        year: "1968",
        title: "Banned after Prague Spring",
        detail: "His plays are prohibited after he opposes the Warsaw Pact invasion of Czechoslovakia.",
      },
      {
        year: "1977",
        title: "Charter 77",
        detail: "Co-authors the human-rights manifesto; imprisoned multiple times in the years that follow.",
      },
      {
        year: "1989",
        title: "Velvet Revolution",
        detail: "Leads the bloodless uprising and is elected president of Czechoslovakia in December.",
      },
      {
        year: "1993",
        title: "First Czech president",
        detail: "Becomes president of the new Czech Republic after the peaceful dissolution.",
      },
    ],
  },
];

export const eras: Figure["era"][] = [
  "19th Century",
  "20th Century",
  "Contemporary",
];

export const regions: Figure["region"][] = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
];

export function getFigure(slug: string): Figure | undefined {
  return figures.find((f) => f.slug === slug);
}

/* ---------- Search & filtering ---------- */

export const officeRoles = [
  "President",
  "Prime Minister",
  "Chancellor",
  "Minister",
  "Secretary",
  "Party Leader",
  "Legislator",
] as const;

export type OfficeRole = (typeof officeRoles)[number];

const officePatterns: Record<OfficeRole, RegExp> = {
  President: /president/i,
  "Prime Minister": /prime minister|premier|taoiseach/i,
  Chancellor: /chancellor/i,
  Minister: /minister/i,
  Secretary: /secretary/i,
  "Party Leader": /leader|chairman|general secretary/i,
  Legislator: /parliament|congress|senat|assembly|deputy|mp\b/i,
};

export function figureOfficeRoles(figure: Figure): OfficeRole[] {
  const text = [figure.title, ...figure.offices].join(" ");
  return officeRoles.filter((role) => officePatterns[role].test(text));
}

const searchIndex = new Map<string, string>(
  figures.map((f) => [
    f.slug,
    [
      f.name,
      f.title,
      f.country,
      f.countryCode,
      f.party,
      f.era,
      f.region,
      f.born,
      f.died ?? "",
      f.summary,
      ...f.bio,
      ...f.offices,
      ...f.timeline.flatMap((t) => [t.year, t.title, t.detail]),
    ]
      .join(" ")
      .toLowerCase(),
  ]),
);

export type FigureFilters = {
  query: string;
  era: Figure["era"] | "all";
  region: Figure["region"] | "all";
  office: OfficeRole | "all";
};

export function searchFigures({
  query,
  era,
  region,
  office,
}: FigureFilters): Figure[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  return figures.filter((f) => {
    if (era !== "all" && f.era !== era) return false;
    if (region !== "all" && f.region !== region) return false;
    if (office !== "all" && !figureOfficeRoles(f).includes(office)) return false;
    if (terms.length === 0) return true;
    const haystack = searchIndex.get(f.slug) ?? "";
    return terms.every((t) => haystack.includes(t));
  });
}

