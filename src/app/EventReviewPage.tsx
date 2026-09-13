import { useMemo, useRef, useState } from "react";

import { Button } from "./UiPrimitives";
import { parseCsv, serializeCsv, type CsvDocument } from "./eventReviewCsv";
import {
  calculateReviewSuccessChance,
  parseProbabilityWeights,
  reviewProbabilityStatNames,
  serializeProbabilityWeights,
  type ReviewProbabilityStat,
} from "./eventReviewProbability";

const copy = {
  achievement: "Logro otorgado",
  age: "Año",
  allAges: "Todos los años",
  bonus: "Bonus otorgado",
  chance: "Probabilidad base",
  choice: "Elección",
  choiceDescription: "Descripción",
  choiceLabel: "Nombre de la elección",
  csvLoaded: "CSV cargado.",
  csvSaved: "Cambios guardados en el CSV.",
  dirty: "Hay cambios sin guardar",
  download: "Descargar CSV",
  editEvent: "Editar evento",
  empty: "Abre un CSV de eventos para empezar la revisión.",
  effects: "Cambios de stats",
  eventIntroduction: "Introducción",
  eventNote: "Notas de revisión",
  eventNoteHelp: "Esta nota se guarda en la columna notes del CSV.",
  eventTitle: "Título",
  events: "Eventos",
  failure: "Failure",
  failureCondition: "Condición especial",
  fileFallback:
    "Tu navegador no permite guardar directamente. Se descargó una copia.",
  filter: "Filtrar por nombre, texto o ID",
  kind: "Tipo",
  load: "Abrir CSV",
  next: "Siguiente",
  noEvents: "No hay eventos que coincidan con el filtro.",
  notesPlaceholder:
    "Anota aquí cambios pendientes, dudas de lore o ajustes de balance.",
  noteIndicator: "●",
  outcome: "Outcome",
  preview: "Vista previa del juego",
  previous: "Anterior",
  probabilityExamples: "Probabilidad de Success",
  probabilityHelp:
    "Cada resultado supone que los seis stats y el potencial tienen el valor indicado.",
  probabilityStats: "Stats para la probabilidad",
  review: "Revisión de eventos",
  reward: "Zoid otorgado",
  save: "Guardar CSV",
  saved: "Sin cambios pendientes",
  sourceDetails: "Datos técnicos y de lore",
  stats: "Stats",
  success: "Success",
  temporary: "Herramienta de revisión",
  weight: "Peso",
} as const;

const chanceKind = "chance";
const columns = {
  age: "age",
  baseSuccessChance: "base_success_chance",
  choiceDescription: "choice_description",
  choiceLabel: "choice_label",
  eligibility: "eligibility",
  factions: "factions",
  failureAchievementReward: "failure_achievement_reward",
  failureBonusReward: "failure_bonus_reward",
  failureCondition: "failure_condition",
  failureEffects: "failure_effects",
  failureOutcome: "failure_outcome",
  failureZoidReward: "failure_zoid_reward",
  introduction: "introduction",
  kind: "kind",
  loreBasis: "lore_basis",
  notes: "notes",
  probabilityStats: "probability_stats",
  sourceIds: "source_ids",
  successAchievementReward: "success_achievement_reward",
  successBonusReward: "success_bonus_reward",
  successCondition: "success_condition",
  successEffects: "success_effects",
  successOutcome: "success_outcome",
  successZoidReward: "success_zoid_reward",
  tags: "tags",
  title: "title",
  weight: "weight",
} as const;
const outcomeKinds = { failure: "failure", success: "success" } as const;
const probabilityLevels = [0, 10, 30, 100] as const;
const probabilityStatLabels: Record<ReviewProbabilityStat, string> = {
  strength: "Fuerza",
  piloting: "Pilotaje",
  synchrony: "Sincronía",
  charisma: "Carisma",
  technique: "Técnica",
  tactics: "Táctica",
  potential: "Potencial",
};
const technicalColumns = [
  columns.factions,
  columns.eligibility,
  columns.tags,
  columns.loreBasis,
  columns.sourceIds,
];

interface EventReviewPageProps {
  initialCsv: string;
}

interface ReviewEvent {
  id: string;
  rowIndexes: number[];
}

interface WritableFileHandle {
  createWritable: () => Promise<{
    close: () => Promise<void>;
    write: (contents: string) => Promise<void>;
  }>;
  getFile: () => Promise<File>;
}

export function EventReviewPage({ initialCsv }: EventReviewPageProps) {
  const [document, setDocument] = useState(() =>
    prepareDocument(parseCsv(initialCsv)),
  );
  const [eventId, setEventId] = useState("");
  const [selectedChoice, setSelectedChoice] = useState(0);
  const [ageFilter, setAgeFilter] = useState("");
  const [dirty, setDirty] = useState(false);
  const [fileHandle, setFileHandle] = useState<WritableFileHandle>();
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const events = useMemo(() => groupEvents(document), [document]);
  const ageOptions = getAgeOptions(document);
  const filteredEvents = events.filter((event) => {
    const text = [
      event.id,
      getEventCell(document, event, columns.title),
      getEventCell(document, event, columns.introduction),
    ]
      .join(" ")
      .toLocaleLowerCase();

    return (
      (!ageFilter ||
        getEventCell(document, event, columns.age) === ageFilter) &&
      text.includes(filter.toLocaleLowerCase())
    );
  });
  const activeEvent =
    filteredEvents.find((event) => event.id === eventId) ??
    filteredEvents[0] ??
    events[0];
  const activeIndex = filteredEvents.findIndex(
    (event) => event.id === activeEvent?.id,
  );
  const rowIndex = activeEvent?.rowIndexes[selectedChoice];

  function selectEvent(nextEventId: string) {
    setEventId(nextEventId);
    setSelectedChoice(0);
  }

  function navigate(offset: number) {
    if (activeIndex < 0 || filteredEvents.length === 0) {
      return;
    }

    const nextIndex =
      (activeIndex + offset + filteredEvents.length) % filteredEvents.length;
    selectEvent(filteredEvents[nextIndex].id);
  }

  function updateEventCell(column: string, value: string) {
    if (!activeEvent) {
      return;
    }

    updateRows(activeEvent.rowIndexes, column, value);
  }

  function updateChoiceCell(column: string, value: string) {
    if (rowIndex === undefined) {
      return;
    }

    updateRows([rowIndex], column, value);
  }

  function updateRows(rowIndexes: number[], column: string, value: string) {
    const columnIndex = document.headers.indexOf(column);

    if (columnIndex < 0) {
      return;
    }

    setDocument((current) => ({
      ...current,
      rows: current.rows.map((row, index) =>
        rowIndexes.includes(index)
          ? row.map((cell, cellIndex) =>
              cellIndex === columnIndex ? value : cell,
            )
          : row,
      ),
    }));
    setDirty(true);
    setStatus("");
  }

  function updateIntroduction(value: string) {
    updateEventFirstCell(columns.introduction, value);
  }

  function updateNote(value: string) {
    updateEventFirstCell(columns.notes, value);
  }

  function updateEventFirstCell(column: string, value: string) {
    if (!activeEvent) {
      return;
    }

    const columnIndex = document.headers.indexOf(column);

    if (columnIndex < 0) {
      return;
    }

    setDocument((current) => ({
      ...current,
      rows: current.rows.map((row, index) => {
        const eventRow = activeEvent.rowIndexes.indexOf(index);
        return eventRow < 0
          ? row
          : row.map((cell, cellIndex) =>
              cellIndex === columnIndex ? (eventRow === 0 ? value : "") : cell,
            );
      }),
    }));
    setDirty(true);
    setStatus("");
  }

  async function openCsv() {
    const picker = getFilePicker();

    if (!picker) {
      fileInputRef.current?.click();
      return;
    }

    try {
      const [handle] = await picker({
        types: [
          {
            accept: { "text/csv": [".csv"] },
            description: "CSV",
          },
        ],
      });
      const file = await handle.getFile();
      loadCsv(await file.text());
      setFileHandle(handle);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        throw error;
      }
    }
  }

  async function readSelectedFile(file?: File) {
    if (!file) {
      return;
    }

    loadCsv(await file.text());
    setFileHandle(undefined);
  }

  function loadCsv(csv: string) {
    setDocument(prepareDocument(parseCsv(csv)));
    setDirty(false);
    setEventId("");
    setSelectedChoice(0);
    setStatus(copy.csvLoaded);
  }

  async function saveCsv() {
    if (!fileHandle) {
      downloadCsv();
      setStatus(copy.fileFallback);
      return;
    }

    const writable = await fileHandle.createWritable();
    await writable.write(serializeCsv(document));
    await writable.close();
    setDirty(false);
    setStatus(copy.csvSaved);
  }

  function downloadCsv() {
    const blob = new Blob([serializeCsv(document)], {
      type: "text/csv;charset=utf-8",
    });
    const link = window.document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.download = getDownloadFilename(document);
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setDirty(false);
  }

  if (!activeEvent || rowIndex === undefined) {
    return (
      <main className="event-review event-review--empty">
        <span className="event-review__eyebrow">{copy.temporary}</span>
        <h1>{copy.review}</h1>
        <p>{copy.empty}</p>
        <Button onClick={() => void openCsv()}>{copy.load}</Button>
        <input
          accept=".csv,text/csv"
          className="event-review__file-input"
          onChange={(event) => void readSelectedFile(event.target.files?.[0])}
          ref={fileInputRef}
          type="file"
        />
      </main>
    );
  }

  const choiceRows = activeEvent.rowIndexes;

  return (
    <main className="event-review">
      <header className="event-review__header">
        <div>
          <span className="event-review__eyebrow">{copy.temporary}</span>
          <h1>{copy.review}</h1>
          <p>{activeEvent.id}</p>
        </div>
        <div className="event-review__actions">
          <span className={dirty ? "event-review__dirty" : ""}>
            {dirty ? copy.dirty : copy.saved}
          </span>
          <Button className="button--secondary" onClick={() => void openCsv()}>
            {copy.load}
          </Button>
          <Button className="button--secondary" onClick={downloadCsv}>
            {copy.download}
          </Button>
          <Button onClick={() => void saveCsv()}>{copy.save}</Button>
          <input
            accept=".csv,text/csv"
            className="event-review__file-input"
            onChange={(event) => void readSelectedFile(event.target.files?.[0])}
            ref={fileInputRef}
            type="file"
          />
        </div>
      </header>

      {status ? <p className="event-review__status">{status}</p> : null}

      <div className="event-review__layout">
        <aside className="event-review__sidebar">
          <div className="event-review__sidebar-heading">
            <h2>{copy.events}</h2>
            <span>{filteredEvents.length}</span>
          </div>
          <input
            aria-label={copy.filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={copy.filter}
            type="search"
            value={filter}
          />
          <select
            aria-label={copy.age}
            onChange={(event) => setAgeFilter(event.target.value)}
            value={ageFilter}
          >
            <option value="">{copy.allAges}</option>
            {ageOptions.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
          <nav className="event-review__event-list">
            {filteredEvents.length === 0 ? <p>{copy.noEvents}</p> : null}
            {filteredEvents.map((event) => (
              <button
                data-active={event.id === activeEvent.id || undefined}
                key={event.id}
                onClick={() => selectEvent(event.id)}
                type="button"
              >
                <span>{getEventCell(document, event, columns.title)}</span>
                <small>{event.id}</small>
                {getEventCell(document, event, columns.notes) ? (
                  <i aria-label={copy.eventNote}>{copy.noteIndicator}</i>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        <div className="event-review__content">
          <section className="event-review__preview">
            <div className="decision-screen__terminal-bar">
              <span className="decision-screen__channel">{copy.preview}</span>
              <span>
                {activeIndex + 1} / {filteredEvents.length}
              </span>
            </div>
            <div className="event-review__briefing">
              <span>{activeEvent.id}</span>
              <h2>{getEventCell(document, activeEvent, columns.title)}</h2>
              <p>{getEventCell(document, activeEvent, columns.introduction)}</p>
            </div>
            <div className="decision-screen__choice-grid">
              {choiceRows.map((choiceRowIndex, index) => (
                <button
                  className="decision-option"
                  data-selected={selectedChoice === index}
                  key={choiceRowIndex}
                  onClick={() => setSelectedChoice(index)}
                  type="button"
                >
                  <span className="decision-option__copy">
                    <strong>
                      {getCell(document, choiceRowIndex, columns.choiceLabel)}
                    </strong>
                    <span>
                      {getCell(
                        document,
                        choiceRowIndex,
                        columns.choiceDescription,
                      )}
                    </span>
                  </span>
                  <span
                    className={`decision-option__kind decision-option__kind--${getCell(document, choiceRowIndex, columns.kind)}`}
                  >
                    {getCell(document, choiceRowIndex, columns.kind)}
                    {getCell(
                      document,
                      choiceRowIndex,
                      columns.baseSuccessChance,
                    )
                      ? ` · ${getCell(document, choiceRowIndex, columns.baseSuccessChance)}%`
                      : ""}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="event-review__pager">
            <Button className="button--secondary" onClick={() => navigate(-1)}>
              {copy.previous}
            </Button>
            <Button className="button--secondary" onClick={() => navigate(1)}>
              {copy.next}
            </Button>
          </div>

          <section className="event-review__editor">
            <h2>{copy.editEvent}</h2>
            <div className="event-review__event-fields">
              <EditorField
                label={copy.eventTitle}
                onChange={(value) => updateEventCell(columns.title, value)}
                value={getEventCell(document, activeEvent, columns.title)}
              />
              <EditorField
                label={copy.age}
                onChange={(value) => updateEventCell(columns.age, value)}
                value={getEventCell(document, activeEvent, columns.age)}
              />
              <EditorField
                label={copy.weight}
                onChange={(value) => updateEventCell(columns.weight, value)}
                value={getEventCell(document, activeEvent, columns.weight)}
              />
            </div>
            <EditorField
              label={copy.eventIntroduction}
              multiline
              onChange={updateIntroduction}
              value={getEventCell(document, activeEvent, columns.introduction)}
            />
            <h3>
              {copy.choice} {selectedChoice + 1}
            </h3>
            <div className="event-review__choice-fields">
              <EditorField
                label={copy.choiceLabel}
                onChange={(value) =>
                  updateChoiceCell(columns.choiceLabel, value)
                }
                value={getCell(document, rowIndex, columns.choiceLabel)}
              />
              <EditorField
                label={copy.kind}
                onChange={(value) => updateChoiceCell(columns.kind, value)}
                value={getCell(document, rowIndex, columns.kind)}
              />
              <EditorField
                label={copy.chance}
                onChange={(value) =>
                  updateChoiceCell(columns.baseSuccessChance, value)
                }
                value={getCell(document, rowIndex, columns.baseSuccessChance)}
              />
            </div>
            {getCell(document, rowIndex, columns.kind) === chanceKind ? (
              <ProbabilityEditor
                baseSuccessChance={getCell(
                  document,
                  rowIndex,
                  columns.baseSuccessChance,
                )}
                onChange={(value) =>
                  updateChoiceCell(columns.probabilityStats, value)
                }
                value={getCell(document, rowIndex, columns.probabilityStats)}
              />
            ) : null}
            <EditorField
              label={copy.choiceDescription}
              multiline
              onChange={(value) =>
                updateChoiceCell(columns.choiceDescription, value)
              }
              value={getCell(document, rowIndex, columns.choiceDescription)}
            />
            <div className="event-review__outcomes">
              <OutcomeEditor
                achievement={getCell(
                  document,
                  rowIndex,
                  columns.successAchievementReward,
                )}
                bonus={getCell(document, rowIndex, columns.successBonusReward)}
                condition={getCell(
                  document,
                  rowIndex,
                  columns.successCondition,
                )}
                effects={getCell(document, rowIndex, columns.successEffects)}
                kind={outcomeKinds.success}
                onChange={updateChoiceCell}
                outcome={getCell(document, rowIndex, columns.successOutcome)}
                reward={getCell(document, rowIndex, columns.successZoidReward)}
                title={copy.success}
              />
              <OutcomeEditor
                achievement={getCell(
                  document,
                  rowIndex,
                  columns.failureAchievementReward,
                )}
                bonus={getCell(document, rowIndex, columns.failureBonusReward)}
                condition={getCell(
                  document,
                  rowIndex,
                  columns.failureCondition,
                )}
                effects={getCell(document, rowIndex, columns.failureEffects)}
                kind={outcomeKinds.failure}
                onChange={updateChoiceCell}
                outcome={getCell(document, rowIndex, columns.failureOutcome)}
                reward={getCell(document, rowIndex, columns.failureZoidReward)}
                title={copy.failure}
              />
            </div>
            <details className="event-review__technical">
              <summary>{copy.sourceDetails}</summary>
              {technicalColumns.map((column) => (
                <EditorField
                  key={column}
                  label={column}
                  multiline={column === columns.loreBasis}
                  onChange={(value) => updateEventCell(column, value)}
                  value={getEventCell(document, activeEvent, column)}
                />
              ))}
            </details>
            <EditorField
              help={copy.eventNoteHelp}
              label={copy.eventNote}
              multiline
              onChange={updateNote}
              placeholder={copy.notesPlaceholder}
              value={getEventCell(document, activeEvent, columns.notes)}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

interface EditorFieldProps {
  label: string;
  onChange: (value: string) => void;
  help?: string;
  multiline?: boolean;
  placeholder?: string;
  value: string;
}

function EditorField({
  label,
  onChange,
  help,
  multiline = false,
  placeholder,
  value,
}: EditorFieldProps) {
  return (
    <label className="event-review__field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          value={value}
        />
      ) : (
        <input
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      )}
      {help ? <small>{help}</small> : null}
    </label>
  );
}

interface ProbabilityEditorProps {
  baseSuccessChance: string;
  onChange: (value: string) => void;
  value: string;
}

function ProbabilityEditor({
  baseSuccessChance,
  onChange,
  value,
}: ProbabilityEditorProps) {
  const weights = parseProbabilityWeights(value);
  const baseChance = Number(baseSuccessChance) || 0;

  function updateWeight(stat: ReviewProbabilityStat, weight: number) {
    onChange(serializeProbabilityWeights({ ...weights, [stat]: weight }));
  }

  return (
    <section className="event-review__probability">
      <div>
        <h3>{copy.probabilityStats}</h3>
        <div className="event-review__stat-weights">
          {reviewProbabilityStatNames.map((stat) => (
            <label key={stat}>
              <span>{probabilityStatLabels[stat]}</span>
              <input
                min="0"
                onChange={(event) =>
                  updateWeight(stat, Number(event.target.value))
                }
                step="0.05"
                type="number"
                value={weights[stat]}
              />
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3>{copy.probabilityExamples}</h3>
        <p>{copy.probabilityHelp}</p>
        <div className="event-review__probability-examples">
          {probabilityLevels.map((level) => (
            <div key={level}>
              <span>
                {copy.stats} {level}
              </span>
              <strong>
                {calculateReviewSuccessChance(baseChance, weights, level)}%
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface OutcomeEditorProps {
  achievement: string;
  bonus: string;
  condition: string;
  effects: string;
  kind: "failure" | "success";
  onChange: (column: string, value: string) => void;
  outcome: string;
  reward: string;
  title: string;
}

function OutcomeEditor({
  achievement,
  bonus,
  condition,
  effects,
  kind,
  onChange,
  outcome,
  reward,
  title,
}: OutcomeEditorProps) {
  return (
    <section className="event-review__outcome" data-kind={kind}>
      <h3>{title}</h3>
      <EditorField
        label={copy.outcome}
        multiline
        onChange={(value) => onChange(`${kind}_outcome`, value)}
        value={outcome}
      />
      <EditorField
        label={copy.effects}
        onChange={(value) => onChange(`${kind}_effects`, value)}
        value={effects}
      />
      <EditorField
        label={copy.achievement}
        onChange={(value) => onChange(`${kind}_achievement_reward`, value)}
        value={achievement}
      />
      <EditorField
        label={copy.bonus}
        onChange={(value) => onChange(`${kind}_bonus_reward`, value)}
        value={bonus}
      />
      <EditorField
        label={copy.reward}
        onChange={(value) => onChange(`${kind}_zoid_reward`, value)}
        value={reward}
      />
      <EditorField
        label={copy.failureCondition}
        onChange={(value) => onChange(`${kind}_condition`, value)}
        value={condition}
      />
    </section>
  );
}

function groupEvents(document: CsvDocument): ReviewEvent[] {
  const eventIdIndex = document.headers.indexOf("event_id");
  const events = new Map<string, ReviewEvent>();

  document.rows.forEach((row, rowIndex) => {
    const id = row[eventIdIndex];
    const event = events.get(id);

    if (event) {
      event.rowIndexes.push(rowIndex);
    } else if (id) {
      events.set(id, { id, rowIndexes: [rowIndex] });
    }
  });

  return [...events.values()];
}

function getEventCell(
  document: CsvDocument,
  event: ReviewEvent,
  column: string,
): string {
  return getCell(document, event.rowIndexes[0], column);
}

function getAgeOptions(document: CsvDocument): string[] {
  const ageIndex = document.headers.indexOf(columns.age);
  return [
    ...new Set(document.rows.map((row) => row[ageIndex]).filter(Boolean)),
  ];
}

function getDownloadFilename(document: CsvDocument): string {
  const age = getAgeOptions(document).join("-") || "all";
  return `events-years-${age}.csv`;
}

function getCell(
  document: CsvDocument,
  rowIndex: number,
  column: string,
): string {
  return document.rows[rowIndex]?.[document.headers.indexOf(column)] ?? "";
}

function prepareDocument(document: CsvDocument): CsvDocument {
  const headers = document.headers.includes(columns.notes)
    ? document.headers
    : [...document.headers, columns.notes];

  return {
    headers,
    rows: document.rows.map((row) => [
      ...row,
      ...Array(Math.max(0, headers.length - row.length)).fill(""),
    ]),
  };
}

function getFilePicker() {
  return (
    window as typeof window & {
      showOpenFilePicker?: (options: {
        types: Array<{
          accept: Record<string, string[]>;
          description: string;
        }>;
      }) => Promise<WritableFileHandle[]>;
    }
  ).showOpenFilePicker;
}
