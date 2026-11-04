/*
 * OceanX review prototype — fictional demonstration fixtures.
 * Every entry, person, source excerpt, review and archive example below is synthetic.
 * The six criterion labels follow the public Education Impact Challenge rubric;
 * Living Light is an official track name. The brief text, questions, 1/3/5
 * anchors, demonstration round and implementation rules are our proposals.
 * AI summaries are prepared examples, not results from a live model.
 * See DATA_NOTES.md for the deliberately seeded summary error and test cases.
 */
(function () {
  "use strict";

  const pending = () => ({
    scores: { science: null, audience: null, originality: null, feasibility: null, emotion: null, scale: null },
    rationale: "",
    submitted: false,
    sourceVersion: 1
  });

  const review = (scores, rationale) => ({ scores, rationale, submitted: true, sourceVersion: 1 });

  const data = {
    schemaVersion: 1,
    round: {
      name: "Living Light · Demonstration round",
      stage: "Concept screening",
      track: "Living Light",
      briefVersion: "LL-1 · Proposed demo brief",
      description: "Select concepts for a next-stage conversation about helping museum visitors explore how light works in the ocean. This fictional round demonstrates review decisions; it is not an OceanX event or a live competition.",
      learningOutcome: "After the experience, a visitor can explain the difference between an animal producing light and reflecting light, using one example from the experience.",
      constraints: [
        "Concept-stage review: assess the evidence supplied; a polished prototype is not required.",
        "Use a three-minute visitor interaction as a proposed design constraint, not a measured learning outcome.",
        "Separate a proposed activity, a working demonstration and observed learner results.",
        "Use the same six criteria for every entry in this demonstration track.",
        "A shortlist decision needs two independent, current reviews and no unresolved critical evidence issue.",
        "Shortlisting opens a next-stage conversation; it does not approve scientific content, funding or deployment."
      ],
      questions: [
        "What should the visitor be able to explain or do afterwards?",
        "Which scientific statements need a specialist to check them?",
        "What evidence exists now, and what is only planned?",
        "What must the next team receive to continue the work?"
      ],
      resources: [
        {
          title: "OceanX Education Impact Challenge",
          type: "Official programme reference",
          note: "Reference for the official Living Light track name and six criterion names. The demo brief text, rules, scoring anchors and sample entries are team-created illustrations, not OceanX policy.",
          url: "https://oceanx.org/education/education-impact-challenge/"
        },
        {
          title: "Light Table · Archive example",
          type: "Fictional reference concept",
          note: "A synthetic reference about a shared tabletop interaction. Useful for discussing visitor turn-taking; it supplies no evidence of learning impact or permission to reuse assets."
        },
        {
          title: "Night Signals · Archive example",
          type: "Fictional reference concept",
          note: "A synthetic reference about communicating light with sound and text. Its source files and accessibility results are not available; treat the idea as a discussion prompt."
        }
      ]
    },
    criteria: [
      {
        id: "science",
        label: "Scientific Integrity",
        question: "Is the scientific explanation appropriate, traceable and clear about what remains unverified?",
        anchors: {
          1: "Core scientific claims are unsupported or inconsistent with the supplied evidence.",
          3: "The explanation is plausible and its evidence gaps are identified; specialist checking remains.",
          5: "The supplied material supports the explanation and documents relevant specialist checking for this stage."
        }
      },
      {
        id: "audience",
        label: "Audience",
        question: "Does the entry identify its visitors and a suitable learning experience for them?",
        anchors: {
          1: "The intended visitor and learning purpose are unclear.",
          3: "The audience, learning purpose and proposed interaction are stated and reasonably aligned.",
          5: "The entry provides convincing stage-appropriate evidence of audience fit, with limitations stated."
        }
      },
      {
        id: "originality",
        label: "Originality",
        question: "Does the concept offer a distinctive, relevant way to engage visitors?",
        anchors: {
          1: "The entry does not explain a distinctive contribution.",
          3: "A relevant creative approach is identifiable, although its difference from precedents needs work.",
          5: "A clear creative contribution is demonstrated and its relationship to earlier work is explained."
        }
      },
      {
        id: "feasibility",
        label: "Feasibility",
        question: "Is there a credible route from this concept to its next stage, given its dependencies?",
        anchors: {
          1: "The next step depends on major unexplained technical or delivery assumptions.",
          3: "The next step and main dependencies are described, with unresolved work made explicit.",
          5: "The entry supports a practical next step with a relevant demonstration, resources and clear responsibilities."
        }
      },
      {
        id: "emotion",
        label: "Emotional Impact",
        question: "Does the experience offer a credible reason for visitors to care about its ocean story?",
        anchors: {
          1: "The proposed connection to visitors is unclear or depends on unsupported impact claims.",
          3: "The story offers a plausible emotional connection that has not yet been tested with visitors.",
          5: "The material provides convincing stage-appropriate evidence of the intended emotional connection."
        }
      },
      {
        id: "scale",
        label: "Potential to Scale",
        question: "Could the concept reach additional audiences without hiding its operating and adaptation needs?",
        anchors: {
          1: "Wider use is asserted without explaining delivery or support requirements.",
          3: "A plausible route to reuse is described alongside its main constraints.",
          5: "The entry supports a specific reuse route with clear operating, adaptation and ownership needs."
        }
      }
    ],
    judges: [
      { id: "j1", name: "Alex Morgan", role: "Learning design", initials: "AM" },
      { id: "j2", name: "Sam Rivera", role: "Marine science", initials: "SR" },
      { id: "j3", name: "Jordan Chen", role: "Creative technology", initials: "JC" }
    ],
    entries: [
      {
        id: "ox-014",
        number: "014",
        title: "Luma",
        team: "Studio Lantern · Fictional team",
        tagline: "Signals in the dark",
        description: "A shared light table lets visitors compare producing light with reflecting it, then explain a choice in their own words.",
        color: "#62d5ca",
        format: "Tabletop projection concept",
        sourceVersion: 1,
        assigned: ["j1", "j2"],
        conflicts: [],
        sources: [
          {
            id: "luma-pitch",
            label: "Concept note · Audience and purpose",
            time: "Paragraph 1",
            kind: "Concept note",
            text: "FICTIONAL DEMO SOURCE. Luma is a proposed three-minute tabletop activity for museum visitors aged 10 and above, including accompanying adults. A visitor moves a token between two illustrative scenes: an animal producing light and an object reflecting light from elsewhere. The intended outcome is that the visitor explains the difference using one scene. The drawings are illustrative; they do not represent measured light levels or a species-specific behaviour."
          },
          {
            id: "luma-demo",
            label: "Demonstration note · What exists",
            time: "Paragraph 2",
            kind: "Demonstration note",
            text: "FICTIONAL DEMO SOURCE. The submission includes a clickable storyboard and a recorded walkthrough made by the concept team. The walkthrough shows the choice, explanation prompt and reset flow. It does not show a working projection system or independent visitors. No learner test, improvement estimate or scientific sign-off has been completed. The team requests a marine-science review before developing detailed animal examples."
          },
          {
            id: "luma-handover",
            label: "Next-stage note · Delivery dependencies",
            time: "Paragraph 3",
            kind: "Handover note",
            text: "FICTIONAL DEMO SOURCE. The proposed next step is to test the storyboard with a facilitator before procuring projection hardware. The team can hand over editable drawings, interaction notes and the walkthrough file. A future version is intended to include text labels and a spoken description; their accessibility has not been tested. Projection brightness, venue lighting and visitor turn-taking remain design questions."
          }
        ],
        claims: [
          { id: "luma-c1", text: "The concept targets museum visitors aged 10 and above and asks them to explain producing versus reflecting light.", sourceId: "luma-pitch" },
          { id: "luma-c2", text: "A team-recorded storyboard walkthrough exists; it is not evidence of visitor learning or a working projection system.", sourceId: "luma-demo" },
          { id: "luma-c3", text: "Editable materials are available for a facilitated next-stage test; hardware and accessibility remain to be checked.", sourceId: "luma-handover" }
        ],
        gaps: [
          { id: "luma-g1", title: "Accessibility remains untested", detail: "Text and spoken alternatives are proposed. Agree how the next-stage test will include visitors with different access needs.", sourceId: "luma-handover", critical: false }
        ],
        questions: [
          { id: "luma-q1", text: "What would you ask visitors to explain to check the intended learning outcome?", sourceId: "luma-pitch" },
          { id: "luma-q2", text: "Which scientific examples should the marine-science reviewer check first?", sourceId: "luma-demo" }
        ],
        reviews: {
          j1: pending(),
          j2: review({ science: 4, audience: 4, originality: 4, feasibility: 3, emotion: 4, scale: 3 }, "The concept distinguishes its illustrative story from evidence of learning. A next-stage conversation is reasonable; species examples still need checking and the physical delivery is untested.")
        },
        mentorHint: "Next-stage support: learning design for the visitor explanation task, followed by a science check of the chosen examples."
      },
      {
        id: "ox-027",
        number: "027",
        title: "Reef Resonance",
        team: "Tidal Studio · Fictional team",
        tagline: "Follow the reef's light",
        description: "A dramatic room-scale concept invites visitors to trace imagined light signals through an ocean scene.",
        color: "#a7a2ed",
        format: "Room-scale audiovisual concept",
        sourceVersion: 1,
        assigned: ["j1", "j3"],
        conflicts: [],
        sources: [
          {
            id: "reef-pitch",
            label: "Pitch transcript · Visitor journey",
            time: "00:18–00:42",
            kind: "Pitch transcript",
            text: "FICTIONAL DEMO SOURCE. Reef Resonance proposes an audiovisual room for family groups. Visitors follow a fictional guide through changing light scenes and choose which scenes represent an animal producing light. The reef is a storytelling setting, not a claim that all reef animals produce light. A visual sequence exists as a concept film; the sensing and interactive room have not been built."
          },
          {
            id: "reef-pilot",
            label: "Pilot plan · No results yet",
            time: "Page 2 · Evaluation plan",
            kind: "Pilot plan",
            text: "FICTIONAL DEMO SOURCE. A visitor pilot is PLANNED for a later development stage. The team has not recruited visitors or collected responses. It proposes asking visitors to explain a light-producing example before and after the experience. There are no pilot findings, no measured improvement and no evidence yet that visitors understand the explanation. Any numerical outcome shown in a future mock-up would be a placeholder, not a result."
          },
          {
            id: "reef-build",
            label: "Production outline · Unresolved dependencies",
            time: "Page 3 · Next stage",
            kind: "Production outline",
            text: "FICTIONAL DEMO SOURCE. The next-stage plan requires a venue partner, projection hardware, tracking development and a science adviser. The team can supply the concept film and storyboards, but it has no tested installation, confirmed venue or agreed production budget. The proposed emotional connection is an artistic intention; visitor reactions have not been measured."
          }
        ],
        claims: [
          { id: "reef-c1", text: "A concept film presents an audiovisual experience for family groups; the interactive installation has not been built.", sourceId: "reef-pitch" },
          { id: "reef-c2", text: "A visitor pilot demonstrated improved understanding of how ocean animals produce light.", sourceId: "reef-pilot" },
          { id: "reef-c3", text: "The next stage depends on a venue, hardware, tracking development and a science adviser.", sourceId: "reef-build" }
        ],
        gaps: [
          { id: "reef-g1", title: "Pilot claim contradicts its source", detail: "The prepared summary says the pilot demonstrated improvement. The cited plan explicitly says no visitors were recruited and no results exist. Correct or exclude the claim before progressing the entry.", sourceId: "reef-pilot", critical: true },
          { id: "reef-g2", title: "Delivery dependencies remain open", detail: "A concept film supports the proposal, but venue, hardware and tracking development still need an agreed next-stage plan.", sourceId: "reef-build", critical: false }
        ],
        questions: [
          { id: "reef-q1", text: "Confirm that the pilot is planned and replace any wording that presents it as a completed result.", sourceId: "reef-pilot" },
          { id: "reef-q2", text: "What is the smallest visitor test you can run before committing to a room-scale build?", sourceId: "reef-build" }
        ],
        reviews: {
          j1: review({ science: 3, audience: 4, originality: 4, feasibility: 2, emotion: 5, scale: 2 }, "The audience journey is clear, but the pilot has not happened. These scores reflect the concept rather than the incorrect summary claim. Correct that claim and clarify the first feasible test."),
          j3: review({ science: 3, audience: 4, originality: 5, feasibility: 2, emotion: 4, scale: 2 }, "The film communicates a distinctive idea. The room-scale implementation remains unproven and needs a smaller test. No learning benefit is established by the materials.")
        },
        mentorHint: "Resolve the evidence correction first. A creative technologist could then help define a modest, testable next step."
      },
      {
        id: "ox-038",
        number: "038",
        title: "Afterglow Atlas",
        team: "Pelagic Works · Fictional team",
        tagline: "Explore a map of imagined signals",
        description: "An illustrated ocean map uses labelled stories to distinguish light-producing organisms from reflective surfaces.",
        color: "#e8bd72",
        format: "Interactive map concept",
        sourceVersion: 1,
        assigned: ["j2", "j3"],
        conflicts: [],
        sources: [
          {
            id: "atlas-concept",
            label: "Concept note · Map and audience",
            time: "Paragraph 1",
            kind: "Concept note",
            text: "FICTIONAL DEMO SOURCE. Afterglow Atlas proposes a touch-based illustrated map for visitors aged 12 and above. Selecting a marker opens a short story about producing or reflecting light. The map is a navigation device for the stories. It is not a geographic distribution dataset and does not claim to locate particular organisms in the real ocean."
          },
          {
            id: "atlas-science",
            label: "Content note · Review status",
            time: "Paragraph 2",
            kind: "Content note",
            text: "FICTIONAL DEMO SOURCE. The current map uses placeholder animal illustrations and broad explanations of light production. Each card is labelled illustrative. The team lists the scientific questions it wants checked but has supplied no named scientific references and no record of specialist review. The team proposes checking each animal example before replacing the placeholders."
          },
          {
            id: "atlas-demo",
            label: "Prototype note · Interaction only",
            time: "Paragraph 3",
            kind: "Demonstration note",
            text: "FICTIONAL DEMO SOURCE. A clickable map demonstrates opening and closing story cards. It contains no final scientific content and has not been tested with visitors. The next step is to settle three scientifically supported stories and test whether visitors mistake the map for a real distribution map. A browser implementation is proposed; offline operation has not been checked."
          }
        ],
        claims: [
          { id: "atlas-c1", text: "The proposed map is a story-navigation device for visitors aged 12 and above, not a real distribution dataset.", sourceId: "atlas-concept" },
          { id: "atlas-c2", text: "Animal examples remain placeholders without supplied scientific references or specialist sign-off.", sourceId: "atlas-science" },
          { id: "atlas-c3", text: "A clickable interaction exists; final scientific content, visitor understanding and offline operation remain untested.", sourceId: "atlas-demo" }
        ],
        gaps: [
          { id: "atlas-g1", title: "Scientific review is still needed", detail: "The source is explicit about placeholder content. Reviewers should distinguish an honest concept-stage limitation from evidence of verified scientific integrity.", sourceId: "atlas-science", critical: false }
        ],
        questions: [
          { id: "atlas-q1", text: "Which three stories and supporting sources would replace the placeholders?", sourceId: "atlas-science" },
          { id: "atlas-q2", text: "How will the next test check that visitors do not read the map as real species distribution?", sourceId: "atlas-demo" }
        ],
        reviews: {
          j2: review({ science: 2, audience: 3, originality: 3, feasibility: 4, emotion: 3, scale: 4 }, "Transparent placeholders are helpful, but no scientific references or specialist checks are supplied. I cannot rate scientific integrity highly until the actual stories can be checked."),
          j3: review({ science: 5, audience: 3, originality: 4, feasibility: 4, emotion: 3, scale: 4 }, "I rated scientific integrity highly because the concept openly labels its map and content as illustrative. I treated transparency at this early stage as sufficient; the panel should check that interpretation of the criterion.")
        },
        mentorHint: "A science and learning-design discussion should resolve the different interpretations before a shortlist decision."
      },
      {
        id: "ox-041",
        number: "041",
        title: "Drift Lab",
        team: "Current Collective · Fictional team",
        tagline: "Make a choice. Explain the glow.",
        description: "A facilitated card-and-screen activity helps small groups explain whether a pictured object produces or reflects light.",
        color: "#8eb8ea",
        format: "Facilitated table activity",
        sourceVersion: 1,
        assigned: ["j1", "j2"],
        conflicts: ["j1"],
        sources: [
          {
            id: "drift-concept",
            label: "Concept note · Group activity",
            time: "Paragraph 1",
            kind: "Concept note",
            text: "FICTIONAL DEMO SOURCE. Drift Lab is a proposed facilitated activity for groups of three to five visitors. Visitors place illustrated cards beside a screen, discuss the light in each scene and explain their choice to a facilitator. The illustrations deliberately include both emitted and reflected light. The goal is an explanation in the visitor's own words, not speed or the number of cards completed."
          },
          {
            id: "drift-review",
            label: "Concept history · Prior support",
            time: "Paragraph 2",
            kind: "Disclosure note",
            text: "FICTIONAL DEMO SOURCE. Alex Morgan provided the fictional team with early advice on its learning prompt before this demonstration round. This prior support is declared as a conflict for Alex's review of Drift Lab. Alex has not submitted a review. The organiser should assign another eligible reviewer; the prior advice is not an endorsement of the entry."
          },
          {
            id: "drift-next",
            label: "Next-stage note · Materials and test",
            time: "Paragraph 3",
            kind: "Handover note",
            text: "FICTIONAL DEMO SOURCE. Printable cards, a screen storyboard and facilitator prompts are available as concept materials. There is no visitor trial or learning result. The team proposes testing a paper version first, checking scientific wording with a specialist and observing how the facilitator manages disagreement. The approach depends on staff facilitation, so wider use needs a simple training guide."
          }
        ],
        claims: [
          { id: "drift-c1", text: "Small groups would discuss illustrated scenes and explain emitted versus reflected light to a facilitator.", sourceId: "drift-concept" },
          { id: "drift-c2", text: "Alex Morgan has a declared conflict from prior learning-design support and has not submitted a review.", sourceId: "drift-review" },
          { id: "drift-c3", text: "A paper-first test is proposed; the concept has no visitor results and depends on facilitator support.", sourceId: "drift-next" }
        ],
        gaps: [
          { id: "drift-g1", title: "Facilitator needs are not yet tested", detail: "The concept identifies facilitation as a dependency. A next-stage test should record staff effort and the guidance visitors need.", sourceId: "drift-next", critical: false }
        ],
        questions: [
          { id: "drift-q1", text: "What prompts help a facilitator distinguish a guessed answer from a visitor's explanation?", sourceId: "drift-concept" }
        ],
        reviews: {
          j1: pending(),
          j2: review({ science: 3, audience: 4, originality: 3, feasibility: 4, emotion: 3, scale: 3 }, "The concept has a modest first test and states its scientific and delivery limitations. Reassign the conflicted reviewer before considering a decision; staff facilitation is part of the operating model.")
        },
        mentorHint: "After reassignment, creative technology support could assess whether a screen adds value to the paper activity."
      },
      {
        id: "ox-052",
        number: "052",
        title: "Lightkeeper",
        team: "Harbour Studio · Fictional team",
        tagline: "Tell the story of one signal",
        description: "A short visitor story uses a physical dial and an explanation prompt to explore the difference between emitted and reflected light.",
        color: "#e6a89a",
        format: "Dial-and-screen story concept",
        sourceVersion: 1,
        assigned: ["j1", "j2"],
        conflicts: [],
        sources: [
          {
            id: "keeper-story",
            label: "Story outline · Visitor choice",
            time: "Paragraph 1",
            kind: "Story outline",
            text: "FICTIONAL DEMO SOURCE. Lightkeeper proposes a short story for visitors aged 10 and above. A visitor turns a dial to compare a scene lit by an external lamp with an illustrative animal producing its own light. The visitor then explains what changed. The story uses an imaginary animal character and makes no claim about a particular species or how often the behaviour occurs in nature."
          },
          {
            id: "keeper-demo",
            label: "Demonstration note · Available materials",
            time: "Paragraph 2",
            kind: "Demonstration note",
            text: "FICTIONAL DEMO SOURCE. The team has prepared a browser storyboard and a paper dial. The storyboard presents the two scenes and the explanation prompt; the physical dial is not connected to software. No visitors have tested the activity. A team walkthrough is included to explain the sequence, not to claim that the learning outcome has been achieved."
          },
          {
            id: "keeper-next",
            label: "Next-stage note · Practical test",
            time: "Paragraph 3",
            kind: "Handover note",
            text: "FICTIONAL DEMO SOURCE. The next step is a facilitated paper-dial test followed by a decision about connecting hardware. Editable storyboards and original illustrations can be handed over within this fictional scenario. The team lists specialist review of the explanation, readable text sizes and a non-dial alternative as work still to do. No budget, deployment approval or scientific sign-off is implied."
          }
        ],
        claims: [
          { id: "keeper-c1", text: "An imaginary character and two scenes introduce external light versus light produced by an animal.", sourceId: "keeper-story" },
          { id: "keeper-c2", text: "A browser storyboard and paper dial exist; connected hardware and visitor learning have not been tested.", sourceId: "keeper-demo" },
          { id: "keeper-c3", text: "A facilitated paper test is the proposed next step, with science and accessibility questions still explicit.", sourceId: "keeper-next" }
        ],
        gaps: [
          { id: "keeper-g1", title: "Alternative input needs a design", detail: "The team recognises that a dial may not suit every visitor. The next-stage plan should include another way to choose between scenes.", sourceId: "keeper-next", critical: false }
        ],
        questions: [
          { id: "keeper-q1", text: "What would the paper test need to show before you invest in connected hardware?", sourceId: "keeper-next" }
        ],
        reviews: {
          j1: review({ science: 3, audience: 4, originality: 3, feasibility: 4, emotion: 3, scale: 4 }, "The learning prompt is specific and the next step is modest. There is no visitor evidence yet, but the entry distinguishes its intention from a measured outcome."),
          j2: review({ science: 3, audience: 4, originality: 3, feasibility: 4, emotion: 3, scale: 3 }, "The illustrative character avoids an unsupported species claim. Scientific wording still needs a review, and any next-stage agreement should preserve that limitation.")
        },
        mentorHint: "Learning-design support can define the paper test; a science reviewer can check the explanation before visitor use."
      },
      {
        id: "ox-063",
        number: "063",
        title: "Open Water",
        team: "Blue Hour Collective · Fictional team",
        tagline: "An ocean story you can hear and read",
        description: "An audio-led concept offers a text alternative while visitors compare two descriptions of light beneath the surface.",
        color: "#98c3a8",
        format: "Audio-and-text story concept",
        sourceVersion: 1,
        assigned: ["j1", "j3"],
        conflicts: [],
        sources: [
          {
            id: "water-concept",
            label: "Concept note · Audio and text",
            time: "Paragraph 1",
            kind: "Concept note",
            text: "FICTIONAL DEMO SOURCE. Open Water proposes an audio-led story with the same words available as text. Visitors choose between two narrated scenes and explain which describes an organism producing light. The intended audience is adult museum visitors, including people who prefer listening to reading. Offering two formats is a design intention, not a claim of verified accessibility."
          },
          {
            id: "water-sample",
            label: "Sample note · Current evidence",
            time: "Paragraph 2",
            kind: "Demonstration note",
            text: "FICTIONAL DEMO SOURCE. A short recorded narration and a text storyboard are supplied. The sample uses an imaginary narrator and general descriptions, with species examples left for later scientific review. No listener study, comprehension test or comparison between audio and text has been run. The supplied recording demonstrates tone and sequence only."
          },
          {
            id: "water-delivery",
            label: "Delivery note · Reuse and support",
            time: "Paragraph 3",
            kind: "Handover note",
            text: "FICTIONAL DEMO SOURCE. The team proposes a browser-based player with a local copy for venues without reliable connectivity. Only the storyboard exists: the player, offline behaviour and controls have not been implemented. The next step is a small comparison of audio and text comprehension, followed by a decision about the player. Translation and rights review would be needed before wider distribution."
          }
        ],
        claims: [
          { id: "water-c1", text: "The concept offers adult visitors an audio story and matching text, without claiming that accessibility has been verified.", sourceId: "water-concept" },
          { id: "water-c2", text: "Narration and storyboard samples exist; there are no listener results or checked species examples.", sourceId: "water-sample" },
          { id: "water-c3", text: "Offline delivery is proposed, not implemented; a small comprehension test would precede player development.", sourceId: "water-delivery" }
        ],
        gaps: [
          { id: "water-g1", title: "Delivery plan remains a proposal", detail: "The entry clearly distinguishes its intended player from the supplied samples. Check the first test before treating offline reuse as demonstrated.", sourceId: "water-delivery", critical: false }
        ],
        questions: [
          { id: "water-q1", text: "How will you compare comprehension without treating a preference for audio as proof of better learning?", sourceId: "water-sample" },
          { id: "water-q2", text: "Which controls and text alternatives belong in the first visitor test?", sourceId: "water-delivery" }
        ],
        reviews: {
          j1: pending(),
          j3: review({ science: 3, audience: 3, originality: 3, feasibility: 4, emotion: 4, scale: 3 }, "The samples communicate the approach and keep technical claims bounded. A player should follow the proposed comprehension test, and offline reuse should remain an unverified plan.")
        },
        mentorHint: "Learning-design support should shape the comprehension test before technical development begins."
      }
    ]
  };

  globalThis.OX_DATA = data;
  if (typeof module !== "undefined" && module.exports) module.exports = data;
})();
