const DB = {
    substances: [
        { id: 'test', name: 'Testosterone', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 4, neuro: 0, kid: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Nandrolone', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 2, neuro: 0, kid: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Trenbolone', class: 'AAS', tox: { liver: 2, lipid: 5, hct: 3, neuro: 5, kid: 4, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Boldenone', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 6, neuro: 0, kid: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'Dihydroboldenone (DHB)', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 5, neuro: 0, kid: 3, endo: 1, repro: 3 } },
        { id: 'masteron', name: 'Masteron', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 3, neuro: 0, kid: 1, endo: 1, repro: 4 } },
        { id: 'primobolan', name: 'Primobolan', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 2, neuro: 0, kid: 1, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Oxandrolone', class: 'Oral', tox: { liver: 4, lipid: 5, hct: 1, neuro: 0, kid: 1, endo: 1, repro: 2 } },
        { id: 'stanozolol', name: 'Stanozolol', class: 'Oral/Inj', tox: { liver: 5, lipid: 5, hct: 2, neuro: 0, kid: 2, endo: 1, repro: 3 } },
        { id: 'methandienone', name: 'Methandienone', class: 'Oral', tox: { liver: 5, lipid: 4, hct: 3, neuro: 0, kid: 1, endo: 3, repro: 3 } },
        { id: 'gh', name: 'Growth Hormone', class: 'Peptide', tox: { liver: 0, lipid: 2, hct: 0, neuro: 0, kid: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Insulin', class: 'Hormone', tox: { liver: 0, lipid: 1, hct: 0, neuro: 0, kid: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', class: 'Peptide', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 2, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', class: 'Peptide', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 1, endo: 2, repro: 0 } }
    ],
    esters: {
        'test': [ {id:'test_p', name:'Propionate', hl:2}, {id:'test_e', name:'Enanthate', hl:7}, {id:'test_c', name:'Cypionate', hl:8}, {id:'test_sus', name:'Sustanon', hl:15} ],
        'nandrolone': [ {id:'nandrolone_p', name:'Phenylpropionate', hl:4.5}, {id:'nandrolone_d', name:'Decanoate', hl:14} ],
        'trenbolone': [ {id:'trenbolone_a', name:'Acetate', hl:3}, {id:'trenbolone_e', name:'Enanthate', hl:7}, {id:'trenbolone_h', name:'Hexahydrobenzylcarbonate', hl:10} ],
        'boldenone': [ {id:'boldenone_u', name:'Undecylenate', hl:14} ],
        'dhb': [ {id:'dhb_p', name:'Acetate', hl:10} ],
        'masteron': [ {id:'masteron_p', name:'Propionate', hl:2.5}, {id:'masteron_e', name:'Enanthate', hl:7} ],
        'primobolan': [ {id:'primobolan_e', name:'Enanthate', hl:10} ],
        'stanozolol': [ {id:'stanozolol_s', name:'Suspension', hl:24} ],
        'gh': [ {id:'gh_short', name:'Daily', hl:0.1}, {id:'gh_long', name:'Long Acting', hl:168} ],
        'insulin': [ {id:'insulin_r', name:'Regular (R)', hl:0.1}, {id:'insulin_l', name:'Long Acting (Glargine)', hl:24} ],
        'igf1': [ {id:'igf1_lr3', name:'LR3 (Long)', hl:24}, {id:'igf1_des', name:'DES (Short)', hl:0.5} ],
        'mgf': [ {id:'mgf_plain', name:'MGF', hl:0.5}, {id:'peg_mgf', name:'PEG-MGF', hl:48} ]
    },
    risks: {
        liver: [ {id:'chol',n:'Cholestasis'}, {id:'ox',n:'Oxidative Stress'}, {id:'cyt',n:'Cytolysis'}, {id:'fib',n:'Fibrosis'}, {id:'mito',n:'Mitochondrial'}, {id:'met',n:'Methylation'}, {id:'apo',n:'Apoptosis'} ],
        cardio: [ {id:'htn',n:'Hypertension'}, {id:'tach',n:'Tachycardia'}, {id:'lip',n:'Dyslipidemia'}, {id:'thr',n:'Thrombosis'}, {id:'lvh',n:'LVH'}, {id:'endo',n:'Endothelial'}, {id:'arr',n:'Arrhythmia'} ],
        kidney: [ {id:'hyper',n:'Hyperfiltration'}, {id:'fib_k',n:'Fibrosis'}, {id:'elec',n:'Electrolytes'}, {id:'prot',n:'Proteinuria'}, {id:'stone',n:'Stones'}, {id:'tub',n:'Tubular Necrosis'}, {id:'gfr',n:'GFR Drop'} ],
        neuro: [ {id:'dop',n:'Dopamine'}, {id:'glu',n:'Glutamate'}, {id:'gaba',n:'GABA'}, {id:'ser',n:'Serotonin'}, {id:'inf',n:'Inflammation'}, {id:'cog',n:'Cognitive'}, {id:'add',n:'Addiction'} ],
        hemato: [ {id:'ery',n:'Erythrocytosis'}, {id:'visc',n:'Viscosity'}, {id:'coag',n:'Coagulation'}, {id:'anem',n:'Anemia'}, {id:'leuk',n:'Leukocytosis'}, {id:'plat',n:'Platelets'}, {id:'hem',n:'Hemolysis'} ],
        endo: [ {id:'ins',n:'Insulin Resist'}, {id:'est',n:'Estrogen'}, {id:'prl',n:'Prolactin'}, {id:'thy',n:'Thyroid'}, {id:'cor',n:'Cortisol'}, {id:'gh_ax',n:'GH Axis'}, {id:'adr',n:'Adrenals'} ],
        repro: [ {id:'atr',n:'Atrophy'}, {id:'sup',n:'Suppression'}, {id:'sp',n:'Sperm Quality'}, {id:'lib',n:'Libido'}, {id:'ed',n:'Erectile Dys'}, {id:'gyn',n:'Gyno'}, {id:'inf',n:'Infertility'} ]
    },
    support: [
        { t:'Morning Empty', items:[ {n:'Iron Guard', d:'2 caps', m:'Heme synthesis'}, {n:'Citicoline', d:'500mg', m:'Neuro protection'}, {n:'Nattokinase', d:'2 caps', m:'Blood flow'}, {n:'Taurine', d:'2g', m:'Anti-spasm'} ] },
        { t:'Breakfast', items:[ {n:'Astragalus', d:'500mg', m:'Kidney protect'}, {n:'Nebivolol', d:'2.5mg', m:'BP control'}, {n:'Tadalafil', d:'5mg', m:'Blood flow'}, {n:'Berberine', d:'500mg', m:'Insulin sens'}, {n:'D3+K2', d:'5000IU', m:'Bone health'}, {n:'TMG+Folate', d:'1g', m:'Methylation'}, {n:'Bergamot', d:'500mg', m:'Lipids'}, {n:'Bromantan+Fasoracetam', d:'50+100mg', m:'Dopamine/GABA'} ] },
        { t:'Lunch', items:[ {n:'UDCA', d:'1000mg', m:'Liver bile'}, {n:'Pentoxifylline', d:'400mg', m:'Viscosity'}, {n:'Joint Health', d:'2 caps', m:'Joints'}, {n:'Vitamin E', d:'400IU', m:'Antioxidant'} ] },
        { t:'Pre-Workout', items:[ {n:'Agmatine', d:'1000mg', m:'NO Boost'} ] },
        { t:'Evening', items:[ {n:'Telmisartan', d:'80mg', m:'BP/Kidney'}, {n:'Magnesium', d:'400mg', m:'Relaxation'}, {n:'L-Theanine', d:'400mg', m:'Sleep'}, {n:'GH', d:'5IU', m:'Growth', note:'Inj'} ] }
    ],
    shop: {
        'udca': [ {p:'Ozon', pr:'1500 RUB'}, {p:'iHerb', pr:'$25'} ],
        'telmisartan': [ {p:'Apteka', pr:'600 RUB'} ],
        'nebivolol': [ {p:'Ozon', pr:'400 RUB'} ],
        'berberine': [ {p:'iHerb', pr:'$20'} ],
        'taurine': [ {p:'Ozon', pr:'800 RUB'} ],
        'magnesium': [ {p:'Ozon', pr:'900 RUB'} ]
    },
    articles: [
        { t:'PK/PD Basics', c:'Theory', v:120 },
        { t:'Liver Protection', c:'Safety', v:340 },
        { t:'IGF-1: LR3 vs DES', c:'Peptides', v:85 },
        { t:'Estrogen Control', c:'Hormones', v:210 },
        { t:'PCT Protocols', c:'Recovery', v:150 },
        { t:'Blood Work Guide', c:'Labs', v:400 }
    ],
    glossary: {
        'Raw Risk': 'Base risk without support.',
        'Net Risk': 'Remaining risk with support.',
        'Half-life': 'Time to reduce concentration by 50%.',
        'Hematocrit': 'Blood thickness. Critical if >52%.',
        'IGF-1 LR3': 'Long acting IGF-1 (24h).',
        'IGF-1 DES': 'Short acting IGF-1 (20min).',
        'PEG-MGF': 'Pegylated MGF for muscle repair.',
        'Insulin Glargine': 'Long acting insulin.'
    }
};
