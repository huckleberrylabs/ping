const url = "https://www.barreau.qc.ca/umbraco/api/member/search/";
const body = {
  language: "en-US",
  firstname: "",
  lastname: "",
  organisation: "",
  city: "",
  filters: { spokenlanguages: [], domains: [], regions: [] },
  pageSize: 100000,
};

const detailURL = "https://www.barreau.qc.ca/umbraco/api/member/detail";

const lawyerID = "c5-a75fK-g2eg_ASnGPPY9rOEwBYHCldeFtYSIVWQjY";
const detailParams = {
  language: "en-US",
  key: lawyerID,
  token:
    "03AMGVjXhKfDa7dounNF-GAR7U1oiXDtbkrHQpOSn-oGbtzBdm5Wiq_ZnWkAIVjE9wXcA0acluU84TQEOCCUyx3-lszKfoXkRSfzsMdSHPTj2yomOBsaQXt84KqM0UR3Roc7iAnrp6AXz6FcmJWsOmxQSYnqpjVzn7TiRZweXkx5iB2QQQaJ4J7wFJsgkRcJrqQzoXOKl3AXQGhIZMu0DWBFZYjD7XParM7IoA76MOTNw8T4eowd-pQIrcbAgJH0u4nDNNQVlP430YhgYp-VZfvPmoCnfbXYMCow",
};
