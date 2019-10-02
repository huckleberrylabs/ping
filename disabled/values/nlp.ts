import retext from "retext";
import retextKeywords from "retext-keywords";
import nlcstToString from "nlcst-to-string";

export async function tags(input: string | string[]): Promise<string[]> {
  let inputArray;
  if (typeof input === "string") {
    inputArray = [input];
  } else if (Array.isArray(input)) {
    inputArray = input;
  } else {
    throw new Error("Incorrect Input");
  }
  const short = inputArray.filter(e => e.split(" ").length <= 4);
  const long = inputArray.filter(e => e.split(" ").length > 4);
  const processedLong = await Promise.all(
    long.map(text =>
      retext()
        .use(retextKeywords)
        .process(text)
    )
  );
  const outLong = processedLong.map(elem => ({
    words: elem.data.keywords.map(k => nlcstToString(k.matches[0].node)),
    phrases: elem.data.keyphrases.map(k =>
      k.matches[0].nodes.map(nlcstToString).join("")
    ),
  }));
  const shortLong = [].concat.apply(short, outLong.map(e => e.phrases));
  return [...new Set(shortLong)];
}
