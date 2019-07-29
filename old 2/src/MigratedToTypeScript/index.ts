import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";

export const sections = [
  {
    header: "HonchoHub",
    content: "Generates a Dataset of People, Places and Things",
  },
  {
    header: "Options",
    optionList: [
      {
        name: "help",
        description: "Print this usage guide.",
      },
      {
        name: "mode",
        description: "server or worker",
      },
      {
        name: "namespace",
        description: "Provide a namespace to scope systems to.",
      },
    ],
  },
  {
    header: "Example Usage",
    content: "npm start --mode worker --namespace latest",
  },
];

export const options = [
  { name: "help", alias: "h", type: Boolean },
  { name: "mode", alias: "a", type: String, multiple: false },
  { name: "namespace", alias: "n", type: String, multiple: false },
];

const usage = commandLineUsage(sections);
const cli = commandLineArgs(options);

(async () => {
  if (cli.help) {
    console.log("info", usage);
  } else {
    console.log(cli.namespace, cli.mode);
  }
})();
