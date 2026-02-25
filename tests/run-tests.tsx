import assert from "node:assert";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DealsFilterForm } from "../src/components/deals-filter-form";
import { StageColumn } from "../src/components/kanban-stage-column";
import { PreferencesForm } from "../src/components/preferences-form";
import {
  dealStages,
  dealStageLabels,
  type DealStage,
} from "../src/lib/deal-stages";
import { currencyFromCents } from "../src/lib/utils";

type Deal = {
  id: string;
  title: string;
  stage: DealStage;
  value: number;
};

const noop = () => {};

function runFilterAssertions() {
  const html = renderToStaticMarkup(
    <DealsFilterForm
      q="search"
      minValue="10"
      maxValue="100"
      owner="all"
      isAdmin
    />,
  );

  assert(
    html.includes('name="q"'),
    "Filter form should include the search input",
  );
  assert(
    html.includes('name="min"'),
    "Filter form should render minimum value input",
  );
  assert(
    html.includes('name="max"'),
    "Filter form should render maximum value input",
  );
  assert(
    html.includes("<select"),
    "Filter form should render a select element when isAdmin is true",
  );
}

function runStageColumnAssertions() {
  const stage = dealStages[0];
  const emptyMarkup = renderToStaticMarkup(
    <StageColumn
      stage={stage}
      deals={[]}
      dragOverStage={null}
      draggingDealId={null}
      onDragOver={noop}
      onDragLeave={noop}
      onDrop={noop}
      onDragStart={noop}
      onDragEnd={noop}
      onMove={noop}
    />,
  );

  assert(
    emptyMarkup.includes(dealStageLabels[stage]),
    "Stage column should render the configured stage label",
  );
  assert(
    emptyMarkup.includes("Nenhum negócio aqui."),
    "Stage column should show the empty placeholder when no deals are present",
  );

  const deal: Deal = {
    id: "deal-1234",
    title: "Test deal",
    stage,
    value: 245000,
  };

  const dealMarkup = renderToStaticMarkup(
    <StageColumn
      stage={stage}
      deals={[deal]}
      dragOverStage={null}
      draggingDealId={null}
      onDragOver={noop}
      onDragLeave={noop}
      onDrop={noop}
      onDragStart={noop}
      onDragEnd={noop}
      onMove={noop}
    />,
  );

  assert(
    dealMarkup.includes("Test deal"),
    "Stage column should render deal titles",
  );
  assert(
    dealMarkup.includes(currencyFromCents(deal.value)),
    "Stage column should display the formatted deal value",
  );
}

function runPreferencesFormAssertions() {
  const html = renderToStaticMarkup(
    <PreferencesForm
      settings={{
        timezone: "UTC",
        dateFormat: "en-US",
        themePreference: "dark",
        whatsappReminders: false,
      }}
    />,
  );

  assert(
    html.includes('name="timezone"'),
    "Preferences form should expose the timezone selector",
  );
  assert(
    html.includes('value="UTC"'),
    "Preferences form should respect timezone defaults",
  );
  assert(
    html.includes('value="en-US"'),
    "Preferences form should allow selecting en-US date format",
  );
  assert(
    html.includes('name="themePreference"'),
    "Preferences form should render the theme selector",
  );
  assert(
    html.includes('value="dark"'),
    "Preferences form should allow forcing dark mode",
  );
  assert(
    html.includes('name="whatsappReminders"'),
    "Preferences form should expose WhatsApp reminders",
  );
  assert(
    html.includes("Salvar Preferências"),
    "Preferences form should render the submit button",
  );
}

function runAllTests() {
  runFilterAssertions();
  runStageColumnAssertions();
  runPreferencesFormAssertions();
  console.log("✅ Deals components smoke tests passed");
}

runAllTests();
