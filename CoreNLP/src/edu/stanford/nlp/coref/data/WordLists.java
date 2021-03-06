package edu.stanford.nlp.coref.data;

import java.util.Arrays;
import java.util.Set;

import edu.stanford.nlp.util.Generics;

/** Word lists for Chinese and English used in the coref system.
 *
 *  @author Heeyoung Lee
 *  @author Rob Voigt
 *  @author Christopher Manning
 */
public class WordLists {

  private WordLists() { } // just variable declarations

  //
  // WordLists for English
  //

  public static final Set<String> reportVerbEn = Generics.newHashSet(Arrays.asList(
      "accuse", "acknowledge", "add", "admit", "advise", "agree", "alert",
      "allege", "announce", "answer", "apologize", "argue",
      "ask", "assert", "assure", "beg", "blame", "boast",
      "caution", "charge", "cite", "claim", "clarify", "command", "comment",
      "compare", "complain", "concede", "conclude", "confirm", "confront", "congratulate",
      "contend", "contradict", "convey", "counter", "criticize",
      "debate", "decide", "declare", "defend", "demand", "demonstrate", "deny",
      "describe", "determine", "disagree", "disclose", "discount", "discover", "discuss",
      "dismiss", "dispute", "disregard", "doubt", "emphasize", "encourage", "endorse",
      "equate", "estimate", "expect", "explain", "express", "extol", "fear", "feel",
      "find", "forbid", "forecast", "foretell", "forget", "gather", "guarantee", "guess",
      "hear", "hint", "hope", "illustrate", "imagine", "imply", "indicate", "inform",
      "insert", "insist", "instruct", "interpret", "interview", "invite", "issue",
      "justify", "learn", "maintain", "mean", "mention", "negotiate", "note",
      "observe", "offer", "oppose", "order", "persuade", "pledge", "point", "point out",
      "praise", "pray", "predict", "prefer", "present", "promise", "prompt", "propose",
      "protest", "prove", "provoke", "question", "quote", "raise", "rally", "read",
      "reaffirm", "realise", "realize", "rebut", "recall", "reckon", "recommend", "refer",
      "reflect", "refuse", "refute", "reiterate", "reject", "relate", "remark",
      "remember", "remind", "repeat", "reply", "report", "request", "respond",
      "restate", "reveal", "rule", "say", "see", "show", "shout", "signal", "sing",
      "slam", "speculate", "spoke", "spread", "state", "stipulate", "stress",
      "suggest", "support", "suppose", "surmise", "suspect", "swear", "teach",
      "tell", "testify", "think", "threaten", "told", "uncover", "underline",
      "underscore", "urge", "voice", "vow", "warn", "welcome",
      "wish", "wonder", "worry", "write"));

  public static final Set<String> reportNounEn = Generics.newHashSet(Arrays.asList(
      "acclamation", "account", "accusation", "acknowledgment", "address", "addressing",
      "admission", "advertisement", "advice", "advisory", "affidavit", "affirmation", "alert",
      "allegation", "analysis", "anecdote", "annotation", "announcement", "answer", "antiphon",
      "apology", "applause", "appreciation", "argument", "arraignment", "article", "articulation",
      "aside", "assertion", "asseveration", "assurance", "attestation", "attitude",
      "averment", "avouchment", "avowal", "axiom", "backcap", "band-aid", "basic", "belief", "bestowal",
      "bill", "blame", "blow-by-blow", "bomb", "book", "bow", "break", "breakdown", "brief", "briefing",
      "broadcast", "broadcasting", "bulletin", "buzz", "cable", "calendar", "call", "canard", "canon",
      "card", "cause", "censure", "certification", "characterization", "charge", "chat", "chatter",
      "chitchat", "chronicle", "chronology", "citation", "claim", "clarification", "close", "cognizance",
      "comeback", "comment", "commentary", "communication", "communique", "composition", "concept",
      "concession", "conference", "confession", "confirmation", "conjecture", "connotation", "construal",
      "construction", "consultation", "contention", "contract", "convention", "conversation", "converse",
      "conviction", "counterclaim", "credenda", "creed", "critique",
      "cry", "declaration", "defense", "definition", "delineation", "delivery", "demonstration",
      "denial", "denotation", "depiction", "deposition", "description", "detail", "details", "detention",
      "dialogue", "diction", "dictum", "digest", "directive", "disclosure", "discourse", "discovery",
      "discussion", "dispatch", "display", "disquisition", "dissemination", "dissertation", "divulgence",
      "dogma", "editorial", "ejaculation", "emphasis", "enlightenment",
      "enunciation", "essay", "evidence", "examination", "example", "excerpt", "exclamation",
      "excuse", "execution", "exegesis", "explanation", "explication", "exposing", "exposition", "expounding",
      "expression", "eye-opener", "feedback", "fiction", "findings", "fingerprint", "flash", "formulation",
      "fundamental", "gift", "gloss", "goods", "gospel", "gossip", "gratitude", "greeting",
      "guarantee", "hail", "hailing", "handout", "hash", "headlines", "hearing", "hearsay",
      "ideas", "idiom", "illustration", "impeachment", "implantation", "implication", "imputation",
      "incrimination", "indication", "indoctrination", "inference", "info", "information",
      "innuendo", "insinuation", "insistence", "instruction", "intelligence", "interpretation", "interview",
      "intimation", "intonation", "issue", "item", "itemization", "justification", "key", "knowledge",
      "leak", "letter", "locution", "manifesto",
      "meaning", "meeting", "mention", "message", "missive", "mitigation", "monograph", "motive", "murmur",
      "narration", "narrative", "news", "nod", "note", "notice", "notification", "oath", "observation",
      "okay", "opinion", "oral", "outline", "paper", "parley", "particularization", "phrase", "phraseology",
      "phrasing", "picture", "piece", "pipeline", "pitch", "plea", "plot", "portraiture", "portrayal",
      "position", "potboiler", "prating", "precept", "prediction", "presentation", "presentment", "principle",
      "proclamation", "profession", "program", "promulgation", "pronouncement", "pronunciation", "propaganda",
      "prophecy", "proposal", "proposition", "prosecution", "protestation", "publication", "publicity",
      "publishing", "quotation", "ratification", "reaction", "reason", "rebuttal", "receipt", "recital",
      "recitation", "recognition", "record", "recount", "recountal", "refutation", "regulation", "rehearsal",
      "rejoinder", "relation", "release", "remark", "rendition", "repartee", "reply", "report", "reporting",
      "representation", "resolution", "response", "result", "retort", "return", "revelation", "review",
      "rule", "rumble", "rumor", "rundown", "saying", "scandal", "scoop",
      "scuttlebutt", "sense", "showing", "sign", "signature", "significance", "sketch", "skinny", "solution",
      "speaking", "specification", "speech", "statement", "story", "study", "style", "suggestion",
      "summarization", "summary", "summons", "tale", "talk", "talking", "tattle", "telecast",
      "telegram", "telling", "tenet", "term", "testimonial", "testimony", "text", "theme", "thesis",
      "tract", "tractate", "tradition", "translation", "treatise", "utterance", "vent", "ventilation",
      "verbalization", "version", "vignette", "vindication", "warning",
      "warrant", "whispering", "wire", "word", "work", "writ", "write-up", "writeup", "writing",
      "acceptance", "complaint", "concern", "disappointment", "disclose", "estimate", "laugh", "pleasure", "regret",
      "resentment", "view"));

  public static final Set<String> nonWordsEn = Generics.newHashSet(Arrays.asList("mm", "hmm", "ahem", "um"));
  public static final Set<String> copulasEn = Generics.newHashSet(Arrays.asList("is","are","were", "was","be", "been","become","became","becomes","seem","seemed","seems","remain","remains","remained"));
  public static final Set<String> quantifiersEn = Generics.newHashSet(Arrays.asList("not","every","any","none","everything","anything","nothing","all","enough"));
  public static final Set<String> partsEn = Generics.newHashSet(Arrays.asList("half","one","two","three","four","five","six","seven","eight","nine","ten","hundred","thousand","million","billion","tens","dozens","hundreds","thousands","millions","billions","group","groups","bunch","number","numbers","pinch","amount","amount","total","all","mile","miles","pounds"));
  public static final Set<String> temporalsEn = Generics.newHashSet(Arrays.asList(
      "second", "minute", "hour", "day", "week", "month", "year", "decade", "century", "millennium",
      "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "now",
      "yesterday", "tomorrow", "age", "time", "era", "epoch", "morning", "evening", "day", "night", "noon", "afternoon",
      "semester", "trimester", "quarter", "term", "winter", "spring", "summer", "fall", "autumn", "season",
      "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"));


  public static final Set<String> femalePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "her", "hers", "herself", "she" }));
  public static final Set<String> malePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "he", "him", "himself", "his" }));
  public static final Set<String> neutralPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "it", "its", "itself", "where", "here", "there", "which" }));
  public static final Set<String> possessivePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "my", "your", "his", "her", "its","our","their","whose" }));
  public static final Set<String> otherPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "who", "whom", "whose", "where", "when","which" }));
  public static final Set<String> thirdPersonPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "he", "him", "himself", "his", "she", "her", "herself", "hers", "her", "it", "itself", "its", "one", "oneself", "one's", "they", "them", "themself", "themselves", "theirs", "their", "they", "them", "'em", "themselves" }));
  public static final Set<String> secondPersonPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "you", "yourself", "yours", "your", "yourselves" }));
  public static final Set<String> firstPersonPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "i", "me", "myself", "mine", "my", "we", "us", "ourself", "ourselves", "ours", "our" }));
  public static final Set<String> moneyPercentNumberPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "it", "its" }));
  public static final Set<String> dateTimePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "when" }));
  public static final Set<String> organizationPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "it", "its", "they", "their", "them", "which"}));
  public static final Set<String> locationPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "it", "its", "where", "here", "there" }));
  public static final Set<String> inanimatePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "it", "itself", "its", "where", "when" }));
  public static final Set<String> animatePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "i", "me", "myself", "mine", "my", "we", "us", "ourself", "ourselves", "ours", "our", "you", "yourself", "yours", "your", "yourselves", "he", "him", "himself", "his", "she", "her", "herself", "hers", "her", "one", "oneself", "one's", "they", "them", "themself", "themselves", "theirs", "their", "they", "them", "'em", "themselves", "who", "whom", "whose" }));
  public static final Set<String> indefinitePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{"another", "anybody", "anyone", "anything", "each", "either", "enough", "everybody", "everyone", "everything", "less", "little", "much", "neither", "no one", "nobody", "nothing", "one", "other", "plenty", "somebody", "someone", "something", "both", "few", "fewer", "many", "others", "several", "all", "any", "more", "most", "none", "some", "such"}));
  public static final Set<String> relativePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{"that","who","which","whom","where","whose"}));
  public static final Set<String> GPEPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "it", "itself", "its", "they","where" }));
  public static final Set<String> pluralPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "we", "us", "ourself", "ourselves", "ours", "our", "yourself", "yourselves", "they", "them", "themself", "themselves", "theirs", "their" }));
  public static final Set<String> singularPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "i", "me", "myself", "mine", "my", "yourself", "he", "him", "himself", "his", "she", "her", "herself", "hers", "her", "it", "itself", "its", "one", "oneself", "one's" }));
  public static final Set<String> facilityVehicleWeaponPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{ "it", "itself", "its", "they", "where" }));
  public static final Set<String> miscPronounsEn = Generics.newHashSet(Arrays.asList(new String[]{"it", "itself", "its", "they", "where" }));
  public static final Set<String> reflexivePronounsEn = Generics.newHashSet(Arrays.asList(new String[]{"myself", "yourself", "yourselves", "himself", "herself", "itself", "ourselves", "themselves", "oneself"}));
  public static final Set<String> transparentNounsEn = Generics.newHashSet(Arrays.asList(new String[]{"bunch", "group",
      "breed", "class", "ilk", "kind", "half", "segment", "top", "bottom", "glass", "bottle",
      "box", "cup", "gem", "idiot", "unit", "part", "stage", "name", "division", "label", "group", "figure",
      "series", "member", "members", "first", "version", "site", "side", "role", "largest", "title", "fourth",
      "third", "second", "number", "place", "trio", "two", "one", "longest", "highest", "shortest",
      "head", "resident", "collection", "result", "last"
  }));
  public static final Set<String> stopWordsEn = Generics.newHashSet(Arrays.asList(new String[]{"a", "an", "the", "of", "at",
      "on", "upon", "in", "to", "from", "out", "as", "so", "such", "or", "and", "those", "this", "these", "that",
      "for", ",", "is", "was", "am", "are", "'s", "been", "were"}));

  public static final Set<String> notOrganizationPRPEn = Generics.newHashSet(Arrays.asList(new String[]{"i", "me", "myself",
      "mine", "my", "yourself", "he", "him", "himself", "his", "she", "her", "herself", "hers", "here"}));

  public static final Set<String> quantifiers2En = Generics.newHashSet(Arrays.asList("all", "both", "neither", "either"));
  public static final Set<String> determinersEn = Generics.newHashSet(Arrays.asList("the", "this", "that", "these", "those", "his", "her", "my", "your", "their", "our"));
  public static final Set<String> negationsEn = Generics.newHashSet(Arrays.asList("n't","not", "nor", "neither", "never", "no", "non", "any", "none", "nobody", "nothing", "nowhere", "nearly","almost",
      "if", "false", "fallacy", "unsuccessfully", "unlikely", "impossible", "improbable", "uncertain", "unsure", "impossibility", "improbability", "cancellation", "breakup", "lack",
      "long-stalled", "end", "rejection", "failure", "avoid", "bar", "block", "break", "cancel", "cease", "cut", "decline", "deny", "deprive", "destroy", "excuse",
      "fail", "forbid", "forestall", "forget", "halt", "lose", "nullify", "prevent", "refrain", "reject", "rebut", "remain", "refuse", "stop", "suspend", "ward"));
  public static final Set<String> neg_relationsEn = Generics.newHashSet(Arrays.asList("prep_without", "prepc_without", "prep_except", "prepc_except", "prep_excluding", "prepx_excluding",
      "prep_if", "prepc_if", "prep_whether", "prepc_whether", "prep_away_from", "prepc_away_from", "prep_instead_of", "prepc_instead_of"));
  public static final Set<String> modalsEn = Generics.newHashSet(Arrays.asList("can", "could", "may", "might", "must", "should", "would", "seem",
      "able", "apparently", "necessarily", "presumably", "probably", "possibly", "reportedly", "supposedly",
      "inconceivable", "chance", "impossibility", "improbability", "encouragement", "improbable", "impossible",
      "likely", "necessary", "probable", "possible", "uncertain", "unlikely", "unsure", "likelihood", "probability",
      "possibility", "eventual", "hypothetical" , "presumed", "supposed", "reported", "apparent"));

  //
  // WordLists for Chinese
  //

  public static final Set<String> reportVerbZh = Generics.newHashSet(Arrays.asList(
      "???", "???", "???", "???", "???", "???", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????",
      "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????"));

  public static final Set<String> reportNounZh = Generics.newHashSet(Arrays.asList(
	  "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????",
	  "??????", "??????", "??????", "??????", "??????", "??????", "??????"));

  public static final Set<String> nonWordsZh = Generics.newHashSet(Arrays.asList("???", "???", "???"));
  public static final Set<String> copulasZh = Generics.newHashSet(Arrays.asList(new String[]{}));
  public static final Set<String> quantifiersZh = Generics.newHashSet(Arrays.asList("??????", "??????", "??????", "??????", "???"));
  public static final Set<String> partsZh = Generics.newHashSet(Arrays.asList("???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???"));
  public static final Set<String> temporalsZh = Generics.newHashSet(Arrays.asList(
      "???", "??????", "???", "??????", "??????", "???", "??????", "??????", "???", "???", "??????", "??????",
      "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????",
      "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "???", "???",
      "??????", "??????", "??????", "??????", "??????", "??????",
      "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "????????????", "????????????"));

  public static final Set<String> femalePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????" }));
  public static final Set<String> malePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????" }));
  public static final Set<String> neutralPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "???", "??????", "???", "??????", "??????", "??????", "???", "??????", "??????", "??????", "???","??????", "??????", "??????" }));
  public static final Set<String> possessivePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{}));
  public static final Set<String> otherPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "??????", "??????", "??????" }));
  public static final Set<String> thirdPersonPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "???", "??????" }));
  public static final Set<String> secondPersonPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "???" }));
  public static final Set<String> firstPersonPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "??????", "???"}));
  public static final Set<String> moneyPercentNumberPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???" }));
  public static final Set<String> dateTimePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{}));
  public static final Set<String> organizationPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "???", "??????", "???", "??????", "??????", "???", "??????", "??????", "???", "??????", "??????" }));
  public static final Set<String> locationPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "??????", "??????", "??????", "??????", "??????" }));
  public static final Set<String> inanimatePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "???", "??????", "??????", "??????", "???", "??????", "??????", "??????", "???","??????", "??????", "??????" }));
  public static final Set<String> animatePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "???", "??????", "???", "??????", "???", "??????", "???" }));
  public static final Set<String> indefinitePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "??????", "???", "??????", "??????", "??????" }));
  public static final Set<String> relativePronounsZh = Generics.newHashSet(); // Chinese doesn't have relative pronouns
  public static final Set<String> interrogativePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{"???", "????????????", "??????", "???", "??????", "??????", "???", "?????????", "??????", "??????", "??????", "???", "???", "??????", "?????????", "??????", "??????", "?????????", "?????????", "???", "??????", "???", "??????"})); // Need to filter these
  public static final Set<String> GPEPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "??????", "???", "??????", "??????", "??????", "???", "??????", "??????", "??????", "???","??????", "??????", "??????" }));
  public static final Set<String> pluralPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "??????", "??????", "??????", "??????", "??????", "??????" }));
  public static final Set<String> singularPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "???", "???", "???", "???" }));
  public static final Set<String> facilityVehicleWeaponPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "??????", "??????" }));
  public static final Set<String> miscPronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "??????", "??????" }));
  public static final Set<String> reflexivePronounsZh = Generics.newHashSet(Arrays.asList(new String[]{ "??????" }));
  public static final Set<String> transparentNounsZh = Generics.newHashSet(Arrays.asList(new String[]{}));
  public static final Set<String> stopWordsZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "???", "???" }));

  public static final Set<String> notOrganizationPRPZh = Generics.newHashSet(Arrays.asList(new String[]{ "???", "??????", "???", "??????", "???", "??????", "???", "??????" }));

  public static final Set<String> quantifiers2Zh = Generics.newHashSet(Arrays.asList( "???", "??????" ));
  public static final Set<String> determinersZh = Generics.newHashSet(Arrays.asList( "???", "??????", "??????", "???", "??????", "??????" ));
  public static final Set<String> negationsZh = Generics.newHashSet(Arrays.asList( "???", "???", "???", "??????", "??????", "???", "??????", "??????" ));
  public static final Set<String> neg_relationsZh = Generics.newHashSet();
  public static final Set<String> modalsZh = Generics.newHashSet(Arrays.asList( "???", "??????", "??????", "??????", "??????" ));
  public static final Set<String> titleWordsZh = Generics.newHashSet(Arrays.asList(
      "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "?????????",
      "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????",
      "?????????"));
  public static final Set<String> removeWordsZh = Generics.newHashSet(Arrays.asList(
          "_", // [cdm] Don't know the source of this one; doesn't seem to be in devset (with gold mentions)
          "????????????", //"????????????" is a formatting error in CoNLL data
          // "???", // a little dangerous 14 real cases though many not.
          "??????", // okay but rare
          // "??????", // dangerous - real case 1/3 of the time
          // "??????", // dangerous - real case 1/3 of the time
          "??????", // ok
          // "??????", // a little dangerous
          "??????",  // ok
          "?????????", // Xinhua news agency -- kind of a cheat, but....
          "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", // ordinals - should have regex or NER; there are also some with arabic numerals
          "??????", "?????????", "??????" // cdm added these ones
  ));

  public static final Set<String> removeCharsZh = Generics.newHashSet(Arrays.asList(
          // "?????????", // in one spurious mention, but caught by general de rule!
          // "???", // slightly dangerous
          "??????", // "what" -- good one, this interrogative isn't in mentions
          "???", // "Who" -- good interrogative to have
          "???", // "What"
          "??????", // "where" -- rare but okay
          // "??????", // "where" but some are mentions
          // "??????", // "people" -- dangerous
          // "???", // year -- dangerous
          "??????", // "reason" -- okay
          // "??????", // doesn't seem to appear in devset; ends in de
          // "????????????",
          "??????" // "How many" [cdm added used to be t ested separately]
  ));

}
