/* Additional hunts for the idle prototype. Requirements scale with the current region. */
window.IDLE_HUNT_AREAS={
 meadow:{name:'Pradaria dos parceiros',min:1,profile:'Iniciantes e capturas',gold:.9,xp:1,loot:'fur',names:[['Rattata','common'],['Pidgey','common'],['Spearow','common'],['Meowth','uncommon'],['Eevee','rare']]},
 garden:{name:'Jardim florido',min:2,profile:'Sementes e plantas',gold:1,xp:1,loot:'seed',names:[['Oddish','common'],['Bellsprout','common'],['Paras','common'],['Bulbasaur','uncommon'],['Tangela','rare']]},
 hive:{name:'Colmeia silvestre',min:3,profile:'Pólen, asas e ferrões',gold:1.1,xp:1,loot:'powder',names:[['Caterpie','common'],['Weedle','common'],['Venonat','uncommon'],['Butterfree','rare'],['Beedrill','rare']]},
 cliffs:{name:'Penhascos dos ventos',min:4,profile:'Penas e aves',gold:1,xp:1.1,loot:'feather',names:[['Spearow','common'],['Pidgey','common'],['Doduo','uncommon'],['Farfetchd','rare']]},
 beach:{name:'Praia das conchas',min:3,profile:'Pérolas e crustáceos',gold:1.15,xp:.95,loot:'shell',names:[['Krabby','common'],['Shellder','common'],['Staryu','uncommon'],['Squirtle','rare']]},
 marsh:{name:'Pântano venenoso',min:5,profile:'Venenos e tentáculos',gold:1.15,xp:1,loot:'venom',names:[['Ekans','common'],['Grimer','common'],['Venonat','uncommon'],['Tentacool','rare']]},
 dunes:{name:'Dunas de areia',min:5,profile:'Areia e escavação',gold:1.2,xp:.95,loot:'sand',names:[['Sandshrew','common'],['Diglett','common'],['Cubone','uncommon'],['Rhyhorn','rare']]},
 quarry:{name:'Pedreira profunda',min:6,badges:1,profile:'Rochas e minerais',gold:1.3,xp:.9,loot:'ore',names:[['Geodude','common'],['Onix','uncommon'],['Rhyhorn','uncommon'],['Machop','rare']]},
 power:{name:'Usina abandonada',min:6,badges:1,profile:'Eletricidade e metais',gold:1.2,xp:1.05,loot:'charge',names:[['Voltorb','common'],['Magnemite','common'],['Pikachu','uncommon'],['Electabuzz','rare']]},
 dojo:{name:'Pátio de treinamento',min:5,profile:'Treino e lutadores',gold:.9,xp:1.25,loot:'bracelet',names:[['Mankey','common'],['Machop','common'],['Drowzee','uncommon'],['Hitmonlee','rare'],['Hitmonchan','rare']]},
 psychic:{name:'Ruínas psíquicas',min:7,badges:1,profile:'Essências e poderes',gold:1,xp:1.2,loot:'essence',names:[['Drowzee','common'],['Abra','uncommon'],['Exeggcute','uncommon'],['Mr. Mime','rare']]},
 ember:{name:'Trilha das brasas',min:6,badges:1,profile:'Fogo e materiais térmicos',gold:1.15,xp:1,loot:'fireEssence',names:[['Vulpix','common'],['Growlithe','common'],['Ponyta','uncommon'],['Charmander','rare']]},
 volcano:{name:'Cratera vulcânica',min:9,badges:2,profile:'Caçada avançada de Fogo',gold:1.35,xp:1.15,loot:'fireTail',names:[['Ponyta','common'],['Growlithe','common'],['Magmar','rare'],['Charmeleon','rare']]},
 frost:{name:'Gruta gelada',min:8,badges:2,profile:'Gelo e materiais aquáticos',gold:1.15,xp:1.15,loot:'snow',names:[['Seel','common'],['Shellder','common'],['Jynx','uncommon'],['Lapras','rare']]},
 safari:{name:'Reserva selvagem',min:8,badges:2,profile:'Espécies da reserva',gold:1.1,xp:1.05,loot:'fur',names:[['Rhyhorn','common'],['Exeggcute','common'],['Tauros','uncommon'],['Kangaskhan','rare'],['Scyther','rare'],['Pinsir','rare']]},
 dragon:{name:'Santuário dos dragões',min:10,badges:3,field:'rod',profile:'Escamas e dragões',gold:1.25,xp:1.2,loot:'scale',names:[['Magikarp','common'],['Horsea','common'],['Dratini','rare'],['Seadra','uncommon']]}
};
/* Advanced destinations retain the region offset; the Frontier supports uncapped levels. */
Object.assign(window.IDLE_HUNT_AREAS,{
 deepwood:{name:'Floresta ancestral',min:15,profile:'Plantas evoluídas e pesquisa',gold:1.35,xp:1.3,loot:'seed',names:[['Gloom','common'],['Weepinbell','common'],['Parasect','uncommon'],['Venomoth','uncommon'],['Venusaur','rare']]},
 ironmine:{name:'Minas de ferro',min:25,profile:'Minerais e combate resistente',gold:1.6,xp:1.45,loot:'ore',names:[['Graveler','common'],['Machoke','common'],['Magneton','uncommon'],['Rhydon','uncommon'],['Golem','rare']]},
 abyss:{name:'Abismo das marés',min:40,profile:'Caçada aquática avançada',gold:1.7,xp:1.65,loot:'shell',names:[['Seadra','common'],['Tentacruel','common'],['Cloyster','uncommon'],['Starmie','uncommon'],['Gyarados','rare']]},
 haunted:{name:'Cripta das sombras',min:60,profile:'Espíritos e essências raras',gold:1.85,xp:1.9,loot:'essence',names:[['Haunter','common'],['Hypno','common'],['Marowak','uncommon'],['Gengar','rare'],['Alakazam','rare']]},
 inferno:{name:'Caldeira do inferno',min:85,profile:'Fogo e confrontos veteranos',gold:2,xp:2.1,loot:'fireEssence',names:[['Rapidash','common'],['Ninetales','common'],['Magmar','uncommon'],['Arcanine','uncommon'],['Charizard','rare']]},
 glacier:{name:'Coroa glacial',min:120,profile:'Caçadas de gelo de alto nível',gold:2.2,xp:2.35,loot:'snow',names:[['Dewgong','common'],['Cloyster','common'],['Jynx','uncommon'],['Lapras','rare'],['Dragonair','rare']]},
 summit:{name:'Cume dos dragões',min:160,profile:'Dragões e espécies poderosas',gold:2.45,xp:2.65,loot:'scale',names:[['Seadra','common'],['Dragonair','uncommon'],['Aerodactyl','uncommon'],['Gyarados','rare'],['Dragonite','rare']]},
 champions:{name:'Vale dos campeões',min:220,profile:'Espécies finais e treino avançado',gold:2.7,xp:3,loot:'fur',names:[['Machamp','common'],['Rhydon','common'],['Alakazam','uncommon'],['Snorlax','rare'],['Dragonite','rare']]},
 ancient:{name:'Ruínas dos titãs',min:300,profile:'Desafios de resistência extrema',gold:3,xp:3.4,loot:'ore',names:[['Golem','common'],['Kabutops','uncommon'],['Omastar','uncommon'],['Aerodactyl','rare'],['Snorlax','rare']]},
 frontier:{name:'Fronteira sem fim',min:400,endless:true,profile:'Nível ajustável · sem limite',gold:3.4,xp:4,loot:'essence',names:[['Venusaur','common'],['Charizard','common'],['Blastoise','common'],['Gengar','uncommon'],['Dragonite','rare']]}
});
