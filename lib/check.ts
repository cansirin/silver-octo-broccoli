import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

export interface Violation {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  description: string;
  nodes: string[];
}

export interface CheckA11yResponse {
  url: string;
  violations: Violation[];
  incomplete: Violation[];
  inapplicable: Violation[];
}

export const check = async (links: string[]) => {
  try {
    const browser = await chromium.launch();
    const ctx = await browser.newContext();

    const violations: any[] = [];
    const incompleteRules: any[] = [];
    const inapplicableRules: any[] = [];

    const promises = links.map(async (link) => {
      const page = await ctx.newPage();
      await page.goto(link);
      const results = await new AxeBuilder({ page }).analyze();
      const vs = results.violations.map((v) => createViolation(v, link));
      const ir = results.incomplete.map((v) => createViolation(v, link));
      const inr = results.inapplicable.map((v) => createViolation(v, link));

      violations.push(vs.reduce(groupByLink, {}));
      incompleteRules.push(ir.reduce(groupByLink, {}));
      inapplicableRules.push(inr.reduce(groupByLink, {}));
    });

    await Promise.all(promises);

    await browser.close();

    return { violations, incompleteRules, inapplicableRules };
  } catch (error) {
    console.error(error);
  }
};

const createViolation = (v: any, url: string) => ({
  id: v.id,
  impact: v.impact,
  description: v.description,
  link: url,
  nodes: v.nodes.map((node: any) => node.html),
});

const groupByLink = (acc: any, curr: any) => {
  const url = curr.link;
  if (!acc[url]) {
    acc[url] = [];
  }
  acc[url].push(curr);
  return acc;
};
