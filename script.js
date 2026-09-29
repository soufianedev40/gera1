let deVoice=null;
function loadVoice(){
  const voices=window.speechSynthesis.getVoices();
  deVoice=voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith('de'))||null;
}
if('speechSynthesis' in window){
  loadVoice();
  window.speechSynthesis.onvoiceschanged=loadVoice;
}
function speak(t){
  if(!('speechSynthesis' in window)){alert('المتصفح لا يدعم النطق الصوتي، جرب Chrome أو Edge.');return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t);
  u.lang='de-DE';
  if(deVoice)u.voice=deVoice;
  window.speechSynthesis.speak(u);
}
function spkBtn(text){
  const b=document.createElement('span');
  b.className='spk'; b.textContent='🔊';
  b.onclick=(e)=>{e.stopPropagation();speak(text);};
  return b;
}

document.querySelectorAll('.chips').forEach(box=>{
  box.dataset.ex.split(',').forEach(w=>{
    const chip=document.createElement('span'); chip.className='chip';
    chip.appendChild(spkBtn(w));
    const t=document.createElement('span'); t.textContent=w;
    chip.appendChild(t);
    box.appendChild(chip);
  });
});

const pronouns=["ich","du","er/sie","wir","ihr","sie/Sie"];
const spkPronouns=["ich","du","er","wir","ihr","sie"];
const habenPres=["habe","hast","hat","haben","habt","haben"];
const seinPres=["bin","bist","ist","sind","seid","sind"];
const werdenPres=["werde","wirst","wird","werden","werdet","werden"];

const verbs=[
 {inf:"sein",ar:"يكون",pres:["bin","bist","ist","sind","seid","sind"],pret:["war","warst","war","waren","wart","waren"],aux:"sein",part:"gewesen"},
 {inf:"haben",ar:"يملك",pres:["habe","hast","hat","haben","habt","haben"],pret:["hatte","hattest","hatte","hatten","hattet","hatten"],aux:"haben",part:"gehabt"},
 {inf:"gehen",ar:"يذهب",pres:["gehe","gehst","geht","gehen","geht","gehen"],pret:["ging","gingst","ging","gingen","gingt","gingen"],aux:"sein",part:"gegangen"},
 {inf:"kommen",ar:"يأتي",pres:["komme","kommst","kommt","kommen","kommt","kommen"],pret:["kam","kamst","kam","kamen","kamt","kamen"],aux:"sein",part:"gekommen"},
 {inf:"machen",ar:"يفعل",pres:["mache","machst","macht","machen","macht","machen"],pret:["machte","machtest","machte","machten","machtet","machten"],aux:"haben",part:"gemacht"},
 {inf:"sprechen",ar:"يتحدث",pres:["spreche","sprichst","spricht","sprechen","sprecht","sprechen"],pret:["sprach","sprachst","sprach","sprachen","spracht","sprachen"],aux:"haben",part:"gesprochen"},
 {inf:"lernen",ar:"يتعلم",pres:["lerne","lernst","lernt","lernen","lernt","lernen"],pret:["lernte","lerntest","lernte","lernten","lerntet","lernten"],aux:"haben",part:"gelernt"},
 {inf:"essen",ar:"يأكل",pres:["esse","isst","isst","essen","esst","essen"],pret:["aß","aßt","aß","aßen","aßt","aßen"],aux:"haben",part:"gegessen"},
 {inf:"trinken",ar:"يشرب",pres:["trinke","trinkst","trinkt","trinken","trinkt","trinken"],pret:["trank","trankst","trank","tranken","trankt","tranken"],aux:"haben",part:"getrunken"},
 {inf:"können",ar:"يستطيع",pres:["kann","kannst","kann","können","könnt","können"],pret:["konnte","konntest","konnte","konnten","konntet","konnten"],aux:"haben",part:"gekonnt"},
 {inf:"wollen",ar:"يريد",pres:["will","willst","will","wollen","wollt","wollen"],pret:["wollte","wolltest","wollte","wollten","wolltet","wollten"],aux:"haben",part:"gewollt"},
 {inf:"spielen",ar:"يلعب",pres:["spiele","spielst","spielt","spielen","spielt","spielen"],pret:["spielte","spieltest","spielte","spielten","spieltet","spielten"],aux:"haben",part:"gespielt"},
];
function reg(inf,ar,e){
  const s=inf.slice(0,-2);
  const p=e?[s+'e',s+'est',s+'et',s+'en',s+'et',s+'en']:[s+'e',s+'st',s+'t',s+'en',s+'t',s+'en'];
  const pr=e?[s+'ete',s+'etest',s+'ete',s+'eten',s+'etet',s+'eten']:[s+'te',s+'test',s+'te',s+'ten',s+'tet',s+'ten'];
  return {inf,ar,pres:p,pret:pr,aux:"haben",part:'ge'+s+(e?'et':'t')};
}
[["kaufen","يشتري"],["brauchen","يحتاج"],["suchen","يبحث عن"],["zeigen","يُظهر"],["sagen","يقول"],
 ["fragen","يسأل"],["hören","يسمع"],["kochen","يطبخ"],["putzen","ينظف"],["tanzen","يرقص"],
 ["lachen","يضحك"],["weinen","يبكي"],["lieben","يحب"],["glauben","يعتقد"],["meinen","يقصد"],
 ["wünschen","يتمنى"],["danken","يشكر"],["holen","يُحضر"],["zahlen","يدفع"],["bestellen","يطلب (في المطعم)"],
 ["probieren","يجرب"],["studieren","يدرس (في الجامعة)"],["reisen","يسافر"],["wandern","يتنزّه"],["wohnen","يسكن"],
 ["besuchen","يزور"],["erklären","يشرح"],["zeichnen","يرسم",1],["antworten","يجيب",1],["warten","ينتظر",1],
 ["öffnen","يفتح",1],["arbeiten","يعمل",1],["kosten","يكلّف (السعر)",1]
].forEach(([inf,ar,e])=>verbs.push(reg(inf,ar,e)));

const vg=document.getElementById('verbGrid');
verbs.forEach(v=>{
  const auxPres=v.aux==='sein'?seinPres:habenPres;
  const tenses={
    "Präsens (المضارع)":pronouns.map((p,i)=>`${p} ${v.pres[i]}`),
    "Präteritum (الماضي البسيط)":pronouns.map((p,i)=>`${p} ${v.pret[i]}`),
    "Perfekt (الماضي التام)":pronouns.map((p,i)=>`${p} ${auxPres[i]} ${v.part}`),
    "Futur I (المستقبل)":pronouns.map((p,i)=>`${p} ${werdenPres[i]} ${v.inf}`),
  };
  const c=document.createElement('div'); c.className='vcard';
  const top=document.createElement('div'); top.className='rowtop';
  top.innerHTML=`<div><div class="de">${v.inf}</div><div class="ar">${v.ar}</div></div>`;
  top.appendChild(spkBtn(v.inf));
  c.appendChild(top);
  const conj=document.createElement('div'); conj.className='conj';
  Object.entries(tenses).forEach(([label,lines])=>{
    const tb=document.createElement('div'); tb.className='tblock';
    const h=document.createElement('h4'); h.textContent=label; tb.appendChild(h);
    const table=document.createElement('table');
    lines.forEach((l,i)=>{
      const sp=l.indexOf(' ');
      const tr=document.createElement('tr');
      const td1=document.createElement('td'); td1.className='p'; td1.textContent=l.slice(0,sp);
      const td2=document.createElement('td'); td2.textContent=l.slice(sp+1);
      const td3=document.createElement('td'); td3.style.width='24px';
      td3.appendChild(spkBtn(`${spkPronouns[i]} ${l.slice(sp+1)}`));
      tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
      table.appendChild(tr);
    });
    tb.appendChild(table);
    conj.appendChild(tb);
  });
  c.appendChild(conj);
  c.onclick=()=>c.classList.toggle('open');
  vg.appendChild(c);
});

const nomenCats={
 "المنزل":[["der Mann","رجل","der"],["die Frau","امرأة","die"],["das Kind","طفل","das"],
  ["der Tisch","طاولة","der"],["die Tür","باب","die"],["das Fenster","نافذة","das"],
  ["der Stuhl","كرسي","der"],["die Lampe","مصباح","die"],["das Buch","كتاب","das"],
  ["der Computer","حاسوب","der"],["das Haus","منزل","das"],["das Zimmer","غرفة","das"],
  ["das Bett","سرير","das"],["der Schrank","خزانة","der"],["die Küche","مطبخ","die"],
  ["das Bad","حمّام","das"],["der Schlüssel","مفتاح","der"],["die Uhr","ساعة","die"]],
 "الأكل والشرب":[["das Wasser","ماء","das"],["der Apfel","تفاحة","der"],["die Milch","حليب","die"],["das Brot","خبز","das"],
  ["der Kaffee","قهوة","der"],["der Tee","شاي","der"],["der Zucker","سكر","der"],["das Salz","ملح","das"],
  ["der Reis","أرز","der"],["das Fleisch","لحم","das"],["der Fisch","سمك","der"],["das Ei","بيضة","das"],
  ["der Käse","جبن","der"],["das Obst","فواكه","das"],["das Gemüse","خضروات","das"],["der Saft","عصير","der"]],
 "الألوان":[["das Rot","أحمر","das"],["das Blau","أزرق","das"],["das Grün","أخضر","das"],["das Gelb","أصفر","das"],
  ["das Schwarz","أسود","das"],["das Weiß","أبيض","das"],["das Orange","برتقالي","das"],["das Braun","بنّي","das"]],
 "الجسم":[["der Kopf","رأس","der"],["das Auge","عين","das"],["die Hand","يد","die"],["der Fuß","قدم","der"],
  ["der Mund","فم","der"],["die Nase","أنف","die"],["das Ohr","أذن","das"],["das Haar","شعر","das"]],
 "المهن":[["der Lehrer","معلم","der"],["die Lehrerin","معلمة","die"],["der Arzt","طبيب","der"],["die Ärztin","طبيبة","die"],
  ["der Ingenieur","مهندس","der"],["der Student","طالب","der"],["die Studentin","طالبة","die"],["der Koch","طبّاخ","der"]],
 "الحيوانات":[["der Hund","كلب","der"],["die Katze","قطة","die"],["der Vogel","عصفور","der"],["das Pferd","حصان","das"],
  ["die Kuh","بقرة","die"],["der Löwe","أسد","der"],["der Fisch","سمك","der"]],
 "الأماكن والمواصلات":[["die Schule","مدرسة","die"],["der Markt","سوق","der"],["die Stadt","مدينة","die"],
  ["das Auto","سيارة","das"],["der Bus","حافلة","der"],["der Zug","قطار","der"],["die Straße","شارع","die"],
  ["der Freund","صديق","der"],["die Freundin","صديقة","die"]],
 "الوقت والأيام":[["der Montag","الإثنين","der"],["der Dienstag","الثلاثاء","der"],["der Mittwoch","الأربعاء","der"],
  ["der Donnerstag","الخميس","der"],["der Freitag","الجمعة","der"],["der Samstag","السبت","der"],["der Sonntag","الأحد","der"],
  ["heute","اليوم",""],["morgen","غدًا",""],["gestern","أمس",""],["jetzt","الآن",""],["der Tag","اليوم (وحدة زمن)","der"],["die Woche","الأسبوع","die"]],
 "الطقس":[["die Sonne","الشمس","die"],["der Regen","المطر","der"],["der Schnee","الثلج","der"],["der Wind","الريح","der"],
  ["die Wolke","الغيمة","die"],["warm","دافئ",""],["kalt","بارد",""],["das Wetter","الطقس","das"]],
 "الملابس":[["das Hemd","القميص","das"],["die Hose","السروال","die"],["der Schuh","الحذاء","der"],
  ["die Jacke","السترة","die"],["das Kleid","الفستان","das"],["die Mütze","القبعة","die"]],
};
const ng=document.getElementById('nomenGrid');
Object.entries(nomenCats).forEach(([cat,words])=>{
  const h=document.createElement('div'); h.className='catlabel'; h.textContent=cat; ng.appendChild(h);
  const grid=document.createElement('div'); grid.className='grid';
  words.forEach(([de,ar,g])=>{
    const c=document.createElement('div'); c.className='ncard '+g;
    const top=document.createElement('div'); top.className='rowtop';
    top.innerHTML=`<div><div class="de">${de}</div><div class="ar">${ar}</div></div>`;
    top.appendChild(spkBtn(de));
    c.appendChild(top);
    grid.appendChild(c);
  });
  ng.appendChild(grid);
});

const alpha=[["A"],["Ä"],["B"],["C"],["D"],["E"],["F"],["G"],["H"],["I"],["J"],["K"],["L"],["M"],["N"],["O"],["Ö"],["P"],["Q"],["R"],["S"],["ß"],["T"],["U"],["Ü"],["V"],["W"],["X"],["Y"],["Z"]];
const ag=document.getElementById('alphaGrid');
alpha.forEach(([l])=>{
  const c=document.createElement('div'); c.className='lcard';
  const top=document.createElement('div'); top.className='rowtop';
  top.innerHTML=`<div class="de">${l}</div>`;
  top.appendChild(spkBtn(l));
  c.appendChild(top);
  c.onclick=()=>speak(l);
  ag.appendChild(c);
});

const zahlWords=["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn","zwanzig"];
const zahlen=zahlWords.map((w,i)=>[i,w]);
["dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig","hundert"].forEach((w,i)=>zahlen.push([(i+3)*10==90?100:(i+3)*10,w]));
zahlen[zahlen.length-1][0]=100;
const zg=document.getElementById('zahlGrid');
zahlen.forEach(([n,w])=>{
  const c=document.createElement('div'); c.className='lcard';
  const top=document.createElement('div'); top.className='rowtop';
  top.innerHTML=`<div><div class="de" style="font-size:15px">${n}</div><div class="ar" style="font-size:12px">${w}</div></div>`;
  top.appendChild(spkBtn(w));
  c.appendChild(top);
  c.onclick=()=>speak(w);
  zg.appendChild(c);
});

const self_=[["Wie heißt du?","ما اسمك؟"],["Ich heiße ...","اسمي ..."],["Woher kommst du?","من أين أنت؟"],["Ich komme aus ...","أنا من ..."],["Wo wohnst du?","أين تسكن؟"],["Ich wohne in ...","أسكن في ..."],["Wie alt bist du?","كم عمرك؟"],["Ich bin ... Jahre alt","عمري ... سنة"],["Was sprichst du?","ما اللغة التي تتحدثها؟"],["Ich spreche Arabisch und ein bisschen Deutsch","أتحدث العربية وقليلًا من الألمانية"],["Was bist du von Beruf?","ما هي مهنتك؟"],["Ich bin Student / Studentin.","أنا طالب / طالبة."],["Was sind deine Hobbys?","ما هي هواياتك؟"],["Meine Hobbys sind Lesen und Fußball.","هواياتي القراءة وكرة القدم."],["Ich mag Musik.","أحب الموسيقى."]];
const fam=[["die Familie","العائلة"],["der Vater","الأب"],["die Mutter","الأم"],["der Bruder","الأخ"],["die Schwester","الأخت"],["die Eltern","الوالدان"],["der Sohn","الابن"],["die Tochter","الابنة"],["die Großmutter","الجدة"],["der Großvater","الجد"],["der Onkel","العم / الخال"],["die Tante","العمة / الخالة"],["der Cousin","ابن العم"],["die Cousine","ابنة العم"],["das Baby","الرضيع"]];
const famSent=[["Ich habe eine große Familie.","لدي عائلة كبيرة."],["Ich habe zwei Brüder und eine Schwester.","لدي أخوان وأخت واحدة."],["Meine Familie wohnt in Marokko.","تسكن عائلتي في المغرب."],["Mein Vater ist Lehrer.","أبي معلم."],["Meine Mutter ist Ärztin.","أمي طبيبة."],["Ich liebe meine Familie sehr.","أحب عائلتي كثيرًا."]];

function fillPhrases(id,arr){
  const el=document.getElementById(id);
  arr.forEach(([de,ar])=>{
    const d=document.createElement('div'); d.className='phrase';
    const left=document.createElement('div'); left.style.display='flex'; left.style.alignItems='center'; left.style.gap='10px'; left.style.flex='1'; left.style.minWidth='220px';
    left.appendChild(spkBtn(de));
    const t=document.createElement('div'); t.className='de'; t.textContent=de;
    left.appendChild(t);
    const a=document.createElement('div'); a.className='ar'; a.textContent=ar;
    d.appendChild(left); d.appendChild(a);
    el.appendChild(d);
  });
}
const greet=[["Hallo","مرحبًا"],["Guten Morgen","صباح الخير"],["Guten Tag","نهارك سعيد"],["Guten Abend","مساء الخير"],["Gute Nacht","تصبح على خير"],["Wie geht's?","كيف حالك؟"],["Danke","شكرًا"],["Bitte","من فضلك / عفوًا"],["Entschuldigung","عذرًا"],["Tschüss / Auf Wiedersehen","إلى اللقاء"]];
fillPhrases('greetList',greet);
fillPhrases('selfList',self_);
fillPhrases('famList',fam);
fillPhrases('famSentList',famSent);

const qwords=[["Was?","ماذا؟"],["Wer?","من؟"],["Wo?","أين؟"],["Wann?","متى؟"],["Wie?","كيف؟"],["Warum?","لماذا؟"],["Welche(r/s)?","أي؟"],["Wie viel?","كم؟"]];
fillPhrases('qwList',qwords);
const preps=[["in","في"],["auf","على / فوق"],["unter","تحت"],["neben","بجانب"],["vor","أمام"],["hinter","خلف"],["zwischen","بين"],["mit","مع"],["ohne","بدون"],["für","من أجل"]];
fillPhrases('prepList',preps);

function renderQuiz(id,questions){
  const el=document.getElementById(id);
  questions.forEach(q=>{
    const card=document.createElement('div'); card.className='quiz-q';
    const qt=document.createElement('div'); qt.className='qtext'; qt.textContent=q.q;
    card.appendChild(qt);
    const opts=document.createElement('div'); opts.className='quiz-opts';
    q.options.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='quiz-opt'; b.textContent=opt;
      b.onclick=()=>{
        opts.querySelectorAll('button').forEach(x=>x.disabled=true);
        if(i===q.correct){b.classList.add('correct');}
        else{b.classList.add('wrong');opts.children[q.correct].classList.add('correct');}
      };
      opts.appendChild(b);
    });
    card.appendChild(opts);
    el.appendChild(card);
  });
}

renderQuiz('quizSelf',[
 {q:"Wie heißt du?",options:["Ich heiße Sara","Ich bin zwanzig","Danke schön"],correct:0},
 {q:"Woher kommst du?",options:["Ich wohne in Rabat","Ich komme aus Marokko","Ich spiele Fußball"],correct:1},
 {q:"Wie alt bist du?",options:["Ich bin Lehrer","Ich bin fünfzehn Jahre alt","Ich heiße Ahmed"],correct:1},
 {q:"ما معنى 'Ich spreche Arabisch'؟",options:["أسكن في المغرب","أتحدث العربية","لدي أخت"],correct:1},
 {q:"ما معنى 'die Familie'؟",options:["العائلة","المدرسة","الصديق"],correct:0},
 {q:"ما معنى 'der Bruder'؟",options:["الأخت","الأخ","العم"],correct:1},
 {q:"ما معنى 'die Schwester'؟",options:["الأخت","الأخ","الجدة"],correct:0},
 {q:"ما معنى 'die Eltern'؟",options:["الأصدقاء","الأبناء","الوالدان"],correct:2},
 {q:"ماذا تعني 'Ich habe zwei Brüder'؟",options:["لدي أخوان","لدي أختان","لدي ولدان"],correct:0},
 {q:"ما هي الإجابة الصحيحة عن 'Wie heißt du?'؟",options:["Ich bin zehn Jahre alt","Ich heiße Yassin","Ich komme aus Fes"],correct:1},
]);

renderQuiz('quizVerbs',[
 {q:"ich ___ Deutsch (lernen)",options:["lerne","lernst","lernt"],correct:0},
 {q:"du ___ nach Hause (gehen)",options:["gehe","gehst","geht"],correct:1},
 {q:"er ___ ein Buch (lesen)",options:["lese","liest","lesen"],correct:1},
 {q:"wir ___ Wasser (trinken)",options:["trinke","trinkt","trinken"],correct:2},
 {q:"ihr ___ sehr nett (sein)",options:["seid","sind","bist"],correct:0},
 {q:"sie (plural) ___ Fußball (spielen)",options:["spielt","spiele","spielen"],correct:2},
 {q:"ich ___ gestern im Park (sein → Präteritum)",options:["war","bin","werde"],correct:0},
 {q:"er hat das Buch ___ (lesen → Perfekt)",options:["gelest","gelesen","gelesan"],correct:1},
]);

renderQuiz('quizArt',[
 {q:"___ Mann",options:["der","die","das"],correct:0},
 {q:"___ Frau",options:["der","die","das"],correct:1},
 {q:"___ Kind",options:["der","die","das"],correct:2},
 {q:"___ Buch",options:["der","die","das"],correct:2},
 {q:"___ Lampe",options:["der","die","das"],correct:1},
 {q:"___ Computer",options:["der","die","das"],correct:0},
 {q:"___ Mädchen",options:["der","die","das"],correct:2},
 {q:"___ Zeitung",options:["der","die","das"],correct:1},
 {q:"___ Hund",options:["der","die","das"],correct:0},
 {q:"___ Katze",options:["der","die","das"],correct:1},
 {q:"___ Wasser",options:["der","die","das"],correct:2},
 {q:"___ Lehrerin",options:["der","die","das"],correct:1},
 {q:"___ Auto",options:["der","die","das"],correct:2},
 {q:"___ Apfel",options:["der","die","das"],correct:0},
 {q:"___ Haus",options:["der","die","das"],correct:2},
]);

document.querySelectorAll('nav .tab').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('nav .tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.p).classList.add('active');
  };
});