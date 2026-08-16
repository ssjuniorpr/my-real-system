export type Verse = { text: string; reference: string };

export const BIBLE_VERSES: Verse[] = [
  { text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
  { text: "O Senhor é o meu pastor; nada me faltará.", reference: "Salmos 23:1" },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", reference: "Salmos 37:5" },
  { text: "Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.", reference: "Jeremias 29:11" },
  { text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.", reference: "Isaías 41:10" },
  { text: "Sede fortes e corajosos; não temais, nem vos atemorizeis diante deles, porque o Senhor teu Deus é o que vai contigo.", reference: "Deuteronômio 31:6" },
  { text: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.", reference: "Eclesiastes 3:1" },
  { text: "Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias.", reference: "Isaías 40:31" },
  { text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", reference: "Provérbios 3:5" },
  { text: "Combati o bom combate, acabei a carreira, guardei a fé.", reference: "2 Timóteo 4:7" },
  { text: "Portanto, não andeis ansiosos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus.", reference: "Filipenses 4:6" },
  { text: "O Senhor é a minha luz e a minha salvação; a quem temerei?", reference: "Salmos 27:1" },
  { text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", reference: "Mateus 11:28" },
  { text: "Buscai primeiro o Reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", reference: "Mateus 6:33" },
  { text: "Aquietai-vos, e sabei que eu sou Deus.", reference: "Salmos 46:10" },
  { text: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.", reference: "Filipenses 4:4" },
  { text: "O choro pode durar uma noite, mas a alegria vem pela manhã.", reference: "Salmos 30:5" },
  { text: "Grandes coisas fez o Senhor por nós, pelas quais estamos alegres.", reference: "Salmos 126:3" },
  { text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", reference: "1 Pedro 5:7" },
  { text: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo.", reference: "Salmos 23:4" },
  { text: "Porque para Deus nada é impossível.", reference: "Lucas 1:37" },
  { text: "Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.", reference: "Salmos 118:24" },
  { text: "Sede fortes e corajosos; não temais, e não vos atemorizeis, porque o Senhor vosso Deus é aquele que vai convosco.", reference: "Josué 1:9" },
  { text: "E conhecereis a verdade, e a verdade vos libertará.", reference: "João 8:32" },
  { text: "Tudo o que fizerem, façam de todo o coração, como para o Senhor.", reference: "Colossenses 3:23" },
  { text: "O Senhor é bom, um refúgio no dia da angústia; e conhece os que nele confiam.", reference: "Naum 1:7" },
  { text: "Não vos amoldeis a este mundo, mas transformai-vos pela renovação da vossa mente.", reference: "Romanos 12:2" },
  { text: "Porque onde estiver o teu tesouro, aí estará também o teu coração.", reference: "Mateus 6:21" },
  { text: "Bem-aventurado o homem que não anda segundo o conselho dos ímpios.", reference: "Salmos 1:1" },
  { text: "Deleita-te também no Senhor, e ele te concederá os desejos do teu coração.", reference: "Salmos 37:4" },
  { text: "Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.", reference: "Hebreus 11:1" },
  { text: "Não se turbe o vosso coração; credes em Deus, crede também em mim.", reference: "João 14:1" },
];

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getVerseOfTheDay(date: Date = new Date()): Verse {
  const index = dayOfYear(date) % BIBLE_VERSES.length;
  return BIBLE_VERSES[index];
}
