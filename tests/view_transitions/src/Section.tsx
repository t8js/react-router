export type SectionProps = {
  id: string | undefined;
};

const content = [
  "",
  "Duis autem vel eum irrure esse molestiae consequat, vel illum dolore eu fugi et iusto odio dignissim qui blandit praesent luptat exceptur sint occaecat cupiditat non provident, deserunt mollit anim id est laborum et dolor fuga distinct.",
  "At vero eos et accusa praesant luptatum delenit aigue duos dolor et mole provident, simil tempor sunt in culpa qui officia de fuga. Et harumd dereud facilis est er expedit disti eligend optio congue nihil impedit doming id quod assumenda est, omnis dolor repellend.",
];

export const Section = ({ id }: SectionProps) => (
  <main data-id={`section-${id}`}>
    <h1>Section {id}</h1>
    <p>{content[Number(id)] ?? content[0]}</p>
  </main>
);
