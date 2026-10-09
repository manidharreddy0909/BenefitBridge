import type { BenefitsTranslationMap } from './types';

export const HINDI_BENEFITS: BenefitsTranslationMap = {
  'pm-kisan-samman-nidhi': {
    titleExplanation: 'पीएम किसान सम्मान निधि',
    description: 'किसान परिवारों को हर साल ₹6,000 की सीधी आर्थिक मदद मिलती है। यह पैसा ₹2,000 की तीन किस्तों में सीधे बैंक खाते में आता है।',
    benefitAmountWording: 'हर साल ₹6,000 (₹2,000 की 3 किस्तें)',
    howToApplySteps: [
      'pmkisan.gov.in वेबसाइट या नजदीकी सीएससी (CSC) केंद्र पर जाएं',
      'किसान पंजीकरण फॉर्म भरें, आधार नंबर और बैंक पासबुक दें',
      'अपनी जमीन के कागजात (खतौनी या भूलेख) अपलोड करें'
    ],
    deadlinesText: 'पूरे साल कभी भी आवेदन कर सकते हैं',
    translationReviewed: false,
  },
  'pm-awas-yojana-gramin': {
    titleExplanation: 'पीएम आवास योजना ग्रामीण',
    description: 'गांवों में कच्चे या टूटे-फूटे मकानों में रहने वाले गरीब परिवारों को पक्का मकान बनाने के लिए सरकार से सहायता राशि मिलती है।',
    benefitAmountWording: 'मैदानी क्षेत्रों में ₹1.20 लाख / पहाड़ी राज्यों में ₹1.30 लाख',
    howToApplySteps: [
      'ग्राम पंचायत या ग्राम सभा में अपना नाम आवास सूची में देखें',
      'पंचायत सचिव या ब्लॉक कार्यालय के माध्यम से फॉर्म जमा करें'
    ],
    deadlinesText: 'चालू योजना (ऑनगोइंग)',
    translationReviewed: false,
  },
  'pm-svanidhi': {
    titleExplanation: 'पीएम स्वनिधि रेहड़ी-पटरी कर्ज',
    description: 'सड़क किनारे दुकान या रेहड़ी लगाने वाले छोटे व्यापारियों को बिना किसी गारंटी के बैंक से कम ब्याज पर कर्ज मिलता है।',
    benefitAmountWording: 'शुरुआत में ₹10,000 का कर्ज, समय पर चुकाने पर ₹20,000 और ₹50,000 तक',
    howToApplySteps: [
      'pmsvanidhi.mohua.gov.in या नजदीकी सीएससी पर जाएं',
      'वेंडर कार्ड या पहचान पत्र और आधार कार्ड से आवेदन करें'
    ],
    deadlinesText: 'चालू योजना',
    translationReviewed: false,
  },
  'nsp-post-matric-minority': {
    titleExplanation: 'अल्पसंख्यक पोस्ट-मैट्रिक छात्रवृत्ति',
    description: 'मुस्लिम, ईसाई, सिख, बौद्ध, जैन और पारसी समुदाय के छात्रों को कक्षा 11 से लेकर कॉलेज की पढ़ाई के लिए छात्रवृत्ति मिलती है।',
    benefitAmountWording: 'कोर्स की फीस और रहने-खाने का मासिक भत्ता',
    howToApplySteps: [
      'scholarships.gov.in (NSP) पोर्टल पर ऑनलाइन आवेदन करें',
      'अपने स्कूल या कॉलेज से फॉर्म सत्यापित करवाएं'
    ],
    deadlinesText: 'हर साल अगस्त से नवंबर के बीच',
    translationReviewed: false,
  },
  'nsp-post-matric-sc': {
    titleExplanation: 'अनुसूचित जाति पोस्ट-मैट्रिक छात्रवृत्ति',
    description: 'कक्षा 10वीं पास करने के बाद आगे की पढ़ाई के लिए एससी छात्रों को कॉलेज फीस और पढ़ाई के खर्च की पूरी मदद मिलती है।',
    benefitAmountWording: 'पूरी ट्यूशन फीस और सालाना भत्ता',
    howToApplySteps: [
      'NSP पोर्टल या अपने राज्य के छात्रवृत्ति पोर्टल पर आवेदन करें',
      'जाति प्रमाण पत्र और आय प्रमाण पत्र साथ लगाएं'
    ],
    deadlinesText: 'शैक्षणिक सत्र के अनुसार',
    translationReviewed: false,
  },
  'mahadbt-post-matric': {
    titleExplanation: 'महाडीबीटी पोस्ट-मैट्रिक छात्रवृत्ति',
    description: 'महाराष्ट्र के एससी, एसटी और ओबीसी छात्रों को कॉलेज की पढ़ाई के लिए राज्य सरकार द्वारा दी जाने वाली छात्रवृत्ति।',
    benefitAmountWording: 'ट्यूशन फीस और परीक्षा फीस माफी',
    howToApplySteps: [
      'mahadbt.maharashtra.gov.in पर लॉगिन करके योजना चुनें'
    ],
    deadlinesText: 'शैक्षणिक सत्र के अनुसार',
    translationReviewed: false,
  },
  'pm-yasasvi-scholarship': {
    titleExplanation: 'पीएम यशस्वी छात्रवृत्ति',
    description: 'ओबीसी, ईबीसी और विमुक्त जातियों के छात्रों को कक्षा 9वीं और 11वीं में अच्छी स्कूली पढ़ाई के लिए आर्थिक सहायता।',
    benefitAmountWording: '9वीं/10वीं के लिए ₹75,000/वर्ष; 11वीं/12वीं के लिए ₹1,25,000/वर्ष',
    howToApplySteps: [
      'NSP पोर्टल पर पीएम यशस्वी योजना के तहत आवेदन करें'
    ],
    deadlinesText: 'एनएसपी पोर्टल की तारीखों के अनुसार',
    translationReviewed: false,
  },
  'national-means-cum-merit-scholarship': {
    titleExplanation: 'एनएमएमएस मेधावी छात्रवृत्ति',
    description: 'सरकारी स्कूलों में कक्षा 8वीं पास करने वाले जरूरतमंद छात्रों को 9वीं से 12वीं तक आगे पढ़ने के लिए छात्रवृत्ति।',
    benefitAmountWording: 'हर साल ₹12,000 (₹1,000 प्रति माह 4 साल तक)',
    howToApplySteps: [
      'NMMS परीक्षा पास करने के बाद NSP पोर्टल पर क्लेम करें'
    ],
    deadlinesText: 'सालाना चक्र',
    translationReviewed: false,
  },
  'nsfdc-educational-loan': {
    titleExplanation: 'एनएसएफडीसी शिक्षा ऋण',
    description: 'अनुसूचित जाति के छात्रों को तकनीकी और पेशेवर उच्च शिक्षा के लिए बहुत कम ब्याज दर पर दिया जाने वाला शिक्षा ऋण।',
    benefitAmountWording: 'देश में पढ़ाई के लिए ₹20 लाख तक, विदेश में ₹30 लाख तक',
    howToApplySteps: [
      'राज्य एससी वित्त निगम या nsfdc.nic.in पर आवेदन करें'
    ],
    deadlinesText: 'पूरे वर्ष खुला रहता है',
    translationReviewed: false,
  },
  'ayushman-bharat-pmjay': {
    titleExplanation: 'आयुष्मान भारत स्वास्थ्य कार्ड',
    description: 'गरीब परिवारों को किसी भी गंभीर बीमारी के इलाज के लिए सरकारी व प्राइवेट अस्पतालों में मुफ्त कैशलेस इलाज की सुविधा।',
    benefitAmountWording: 'हर परिवार को प्रति वर्ष ₹5,00,000 तक का मुफ्त अस्पताल इलाज',
    howToApplySteps: [
      'नजदीकी सरकारी अस्पताल या सीएससी केंद्र पर जाकर आयुष्मान कार्ड बनवाएं',
      'राशन कार्ड और आधार कार्ड जरूरी है'
    ],
    deadlinesText: 'सदा चालू (ऑनगोइंग)',
    translationReviewed: false,
  },
  'esic-medical-benefit': {
    titleExplanation: 'ईएसआईसी चिकित्सा सुविधा',
    description: 'कंपनियों और कारखानों में काम करने वाले बीमित कर्मचारियों और उनके परिवार को ईएसआईसी अस्पतालों में मुफ्त इलाज।',
    benefitAmountWording: 'मुफ्त अस्पताल इलाज, दवाइयां और बीमारी भत्ता',
    howToApplySteps: [
      'अपने ई-पहचान कार्ड के साथ ईएसआईसी औषधालय जाएं'
    ],
    deadlinesText: 'चालू योजना',
    translationReviewed: false,
  },
  'mgnregs': {
    titleExplanation: 'मनरेगा रोजगार गारंटी योजना',
    description: 'गांवों में अकुशल शारीरिक काम करने को तैयार हर ग्रामीण परिवार को साल में कम से कम 100 दिन के काम की कानूनी गारंटी।',
    benefitAmountWording: 'कम से कम 100 दिन का रोजगार और राज्य सरकार द्वारा तय दैनिक मजदूरी',
    howToApplySteps: [
      'अपनी ग्राम पंचायत में जॉब कार्ड के लिए आवेदन करें',
      'जॉब कार्ड मिलने के बाद काम की मांग करें'
    ],
    deadlinesText: 'चालू योजना',
    translationReviewed: false,
  },
  'e-shram-portal': {
    titleExplanation: 'ई-श्रम असंगठित मजदूर कार्ड',
    description: 'मजदूरों, खेत मजदूरों और छोटे कामगारों का राष्ट्रीय पहचान पत्र और मुफ्त दुर्घटना बीमा कार्ड।',
    benefitAmountWording: '₹2,00,000 का दुर्घटना मृत्यु बीमा और सरकारी योजनाओं का लाभ',
    howToApplySteps: [
      'eshram.gov.in या सीएससी केंद्र पर मुफ्त में रजिस्ट्रेशन कराएं',
      'आधार कार्ड और बैंक खाता नंबर दें'
    ],
    deadlinesText: 'चालू योजना',
    translationReviewed: false,
  },
  'pm-mudra-yojana-shishu': {
    titleExplanation: 'पीएम मुद्रा शिशु ऋण',
    description: 'छोटी दुकान, कारोबार या नया काम शुरू करने के लिए बैंकों से बिना किसी गारंटी के मिलने वाला छोटा व्यापारिक कर्ज।',
    benefitAmountWording: '₹50,000 तक का व्यापार ऋण (बिना किसी गारंटी के)',
    howToApplySteps: [
      'किसी भी सरकारी या ग्रामीण बैंक शाखा में जाकर मुद्रा शिशु फॉर्म भरें'
    ],
    deadlinesText: 'चालू योजना',
    translationReviewed: false,
  },
  'udyam-registration': {
    titleExplanation: 'उद्यम पंजीकरण (एमएसएमई)',
    description: 'छोटे उद्योगों और दुकानों के लिए केंद्र सरकार का मुफ्त आधिकारिक पंजीकरण प्रमाण पत्र।',
    benefitAmountWording: 'सरकारी सब्सिडी, सस्ता बैंक लोन और प्राथमिकता',
    howToApplySteps: [
      'udyamregistration.gov.in पर आधार और पैन से मुफ्त रजिस्ट्रेशन करें'
    ],
    deadlinesText: 'चालू योजना',
    translationReviewed: false,
  },
  'pm-fasal-bima-yojana': {
    titleExplanation: 'पीएम फसल बीमा योजना',
    description: 'सूखा, बाढ़, आंधी या प्राकृतिक आपदा से फसल खराब होने पर किसानों को नुकसान से बचाने वाली फसल बीमा योजना।',
    benefitAmountWording: 'फसल नुकसान का पूरा मुआवजा; किसान प्रीमियम केवल 1.5% से 5%',
    howToApplySteps: [
      'pmfby.gov.in या अपनी बैंक शाखा/सहकारी समिति में बुवाई के बाद पंजीकरण कराएं'
    ],
    deadlinesText: 'खरीफ सीजन (जुलाई/अगस्त), रबी सीजन (दिसंबर/जनवरी)',
    translationReviewed: false,
  },
  'kisan-credit-card': {
    titleExplanation: 'किसान क्रेडिट कार्ड (केसीसी)',
    description: 'किसानों को खाद, बीज और खेती के खर्चों के लिए बैंकों से बहुत कम ब्याज दर पर समय पर कर्ज देने वाला कार्ड।',
    benefitAmountWording: 'जमीन और फसल के अनुसार 4% से 7% की सस्ती ब्याज दर पर बैंक ऋण',
    howToApplySteps: [
      'नजदीकी ग्रामीण या सरकारी बैंक शाखा में या jansamarth.in पर आवेदन करें'
    ],
    deadlinesText: 'चालू योजना',
    translationReviewed: false,
  },
};
