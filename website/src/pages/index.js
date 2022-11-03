import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import CodeBlock from "@theme/CodeBlock";

const features = [
  {
    title: "Easy",
    imageUrl: "", //TODO: add .svg images in img folder
    description: (
      <>
        Remx is designed from the ground up to be the state meneger for all your
        websites and apps that&apos;s easy to install and use.
      </>
    ),
  },
  {
    title: "Zero Boilerplate",
    imageUrl: "",
    description: (
      <>
        Remx lets you focus on features, not the chores. Install Remx in your
        website or app and hit the ground running.
      </>
    ),
  },
  {
    title: "Fast and Reliable",
    imageUrl: "",
    description: (
      <>
        Extend or customize your data management. Remx is reliable and fast to
        use.
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx("col", styles.features)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function ProsAndConsSection() {
  const libraries = ["Redux", "Mobx", "Remx"];
  // TODO: get items and values from Andrii Koguts' presentations
  const items = [
    { name: "Hard to get started", values: [false, true, true] },
    { name: "Data is immutable", values: [false, true, true] },
    { name: "Provides app architecture", values: [true, false, false] },
    { name: "Time travel, persist", values: [true, false, false] },
    { name: "Easy to kill performance", values: [false, true, true] },
    { name: "Lots of boilerplate", values: [false, true, true] },
    { name: "Data is immutable", values: [false, true, true] },
    { name: "Simple API", values: [false, true, true] },
  ];

  return (
    <div>
      <p className={styles.sectionTitle}>PROS AND CONS</p>
      <table className={styles.prosAndConsTable}>
        <tr>
          <th>Product</th>
          {libraries.map((library) => (
            <th>{library}</th>
          ))}
        </tr>
        {items.map((item) => {
          return (
            <tr>
              <td>{item.name}</td>
              {item.values.map((value) => (
                <td>{value ? "✅" : "❌"}</td>
              ))}
            </tr>
          );
        })}
      </table>
    </div>
  );
}

function FeaturesSection() {
  return (
    features &&
    features.length > 0 && (
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {features.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    )
  );
}

const codeExample = `import * as remx from 'remx';

remx.registerLoggerForDebug(console.log);

const initialState = {
  randomJoke: null,
  savedJokes: [{ title: 'slot0', id: '0' }]
};

const state = remx.state(initialState);
const getters = remx.getters({
  getRandomJoke() {
    return state.randomJoke;
  },
  getAllSavedJokes() {
    return state.savedJokes.map((joke) => joke.title);
  }
});

const setters = remx.setters({
  addSlot() {
    state.savedJokes.push({
        title: 'slot' + state.savedJokes.length,
        id: state.savedJokes.length
    });
  },
  editSlot(index, newTitle) {
    if (state.savedJokes[index]) {
      state.savedJokes[index].title = newTitle;
    }
  },
  setJoke(joke) {
    return state.randomJoke = joke;
  }
});

export const store = {
  ...setters,
  ...getters
};
`;

function CodeExampleSection() {
  return (
    <div>
      <p className={styles.sectionTitle}>CODE EXAMPLE</p>
      <div className={styles.codeExampleContainer}>
        {/*TODO: Change to Remx code example description*/}
        <p className={styles.codeExampleDescription}>
          Step two is to render a tree of React components powered by Relay.
          Components use fragments to declare their data dependencies, and read
          data from the Relay store by calling useFragment . A fragment is a
          snippet of GraphQL that is tied to a GraphQL type (like Artist ) and
          which specifies what data to read from an item of that type.
          useFragment takes two parameters: a fragment literal and a fragment
          reference. A fragment reference specifies which entity to read that
          data from. Fragments cannot be fetched by themselves; instead, they
          must ultimately be included in a parent query. The Relay compiler will
          then ensure that the data dependencies declared in such fragments are
          fetched as part of that parent query.
        </p>
        {/*TODO: change styling*/}
        <CodeBlock language="js">{codeExample}</CodeBlock>
      </div>
    </div>
  );
}

// TODO: split custom hero into custom hero, features section, comparison table section, code example section
function CustomHero() {
  return (
    <div
      style={{
        backgroundImage: "url(../../static/img/illustration.svg)",
        mixBlendMode: "soft-light",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top right",
      }}
    >
      <div style={{ marginLeft: "15%", marginRight: "15%" }}>
        <p className={styles.heroTitle}>REMX</p>
        <p className={styles.heroSubtitle}>An easy to use state manager</p>
        <button
          className={styles.gettingStartedContainer}
          onClick={(event) => {
            console.log("open getting started page");
            // window.open(useBaseUrl("docs/introduction/getting-started"));
          }}
          type="button"
        >
          <span
            className={styles.gettingStartedLabel + " " + styles.notSelectable}
          >
            GETTING STARTED
          </span>
          <img
            className={styles.gettingStartedLabel}
            alt={"Right chevron icon"}
            src={"../../static/img/getting_started_btn.svg"}
          />
        </button>

        {FeaturesSection()}

        {ProsAndConsSection()}

        {CodeExampleSection()}
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      {CustomHero()}
    </Layout>
  );
}

export default Home;
