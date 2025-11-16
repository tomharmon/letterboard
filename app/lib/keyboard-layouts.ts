type SpacerCell = {
  type: 'spacer';
  id: string;
  flex?: number;
};

type KeyCell = {
  type: 'key';
  id: string;
  label: string;
  value?: string;
  flex?: number;
};

export type KeyboardCell = SpacerCell | KeyCell;

export type KeyboardRow = KeyboardCell[];

export type KeyboardLayoutId = 'letterboard' | 'qwerty';

export type KeyboardLayout = {
  id: KeyboardLayoutId | 'numeric';
  name: string;
  rows: KeyboardRow[];
  description?: string;
};

const LETTERBOARD_COLUMNS = 6;
const NUMERIC_ROWS = 5;
const NUMERIC_COLUMNS = 6;

const createKey = (label: string, opts: Partial<Omit<KeyCell, 'type' | 'label' | 'id'>> = {}): KeyCell => ({
  type: 'key',
  id: `key-${label}-${opts.value ?? label}`,
  label,
  value: opts.value ?? label,
  flex: opts.flex,
});

const createSpacer = (id: string, flex = 1): SpacerCell => ({
  type: 'spacer',
  id,
  flex,
});

const buildLetterboardRows = (): KeyboardRow[] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const rows: KeyboardRow[] = [];
  let index = 0;

  for (let r = 0; r < 5; r++) {
    const row: KeyboardRow = [];
    for (let c = 0; c < LETTERBOARD_COLUMNS; c++) {
      if (c === LETTERBOARD_COLUMNS - 1) {
        if (r === 4) {
          const letter = letters[index];
          if (letter) {
            row.push(createKey(letter));
          } else {
            row.push(createSpacer(`letterboard-spacer-${r}-${c}`));
          }
        } else {
          row.push(createSpacer(`letterboard-spacer-${r}-${c}`));
        }
        continue;
      }

      const letter = letters[index++];
      if (letter) {
        row.push(createKey(letter));
      } else {
        row.push(createSpacer(`letterboard-spacer-${r}-${c}`));
      }
    }
    rows.push(row);
  }

  return rows;
};

const buildQwertyRows = (): KeyboardRow[] => {
  const rows: string[][] = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split(''),
  ];

  return rows.map((rowLetters, index) => {
    const row: KeyboardRow = rowLetters.map((letter) => createKey(letter));

    if (index === 1) {
      // home row indent
      row.unshift(createSpacer('qwerty-home-indent-left', 0.5));
      row.push(createSpacer('qwerty-home-indent-right', 0.5));
    }

    if (index === 2) {
      // bottom row wider indent
      row.unshift(createSpacer('qwerty-bottom-indent-left', 1));
      row.push(createSpacer('qwerty-bottom-indent-right', 1));
    }

    return row;
  });
};

const buildNumericRows = (): KeyboardRow[] => {
  const rows: KeyboardRow[] = Array.from({ length: NUMERIC_ROWS }, () => []);

  const setCenteredRow = (rowIndex: number, values: string[]) => {
    for (let c = 0; c < NUMERIC_COLUMNS; c++) {
      if (c >= 1 && c <= values.length && rowIndex < rows.length) {
        const value = values[c - 1];
        rows[rowIndex].push(createKey(value));
      } else {
        rows[rowIndex].push(createSpacer(`numeric-spacer-${rowIndex}-${c}`));
      }
    }
  };

  setCenteredRow(0, ['7', '8', '9']);
  setCenteredRow(1, ['4', '5', '6']);
  setCenteredRow(2, ['1', '2', '3']);

  rows[3] = Array.from({ length: NUMERIC_COLUMNS }, (_, c) => {
    if (c >= 1 && c <= 3) {
      const values = ['0', '.', ','];
      return createKey(values[c - 1]);
    }
    return createSpacer(`numeric-spacer-3-${c}`);
  });

  const symbols = ['-', '/', '×', '(', ')'];
  rows[4] = Array.from({ length: NUMERIC_COLUMNS }, (_, c) => {
    if (c >= 1 && c < symbols.length + 1) {
      return createKey(symbols[c - 1]);
    }
    return createSpacer(`numeric-spacer-4-${c}`);
  });

  return rows;
};

export const LETTERBOARD_LAYOUT: KeyboardLayout = {
  id: 'letterboard',
  name: 'Letterboard',
  rows: buildLetterboardRows(),
  description: 'Alphabetical letterboard layout (columns A–Z).',
};

export const QWERTY_LAYOUT: KeyboardLayout = {
  id: 'qwerty',
  name: 'QWERTY',
  rows: buildQwertyRows(),
  description: 'Traditional QWERTY staggered keyboard layout.',
};

export const NUMERIC_LAYOUT: KeyboardLayout = {
  id: 'numeric',
  name: 'Numbers & Symbols',
  rows: buildNumericRows(),
};

export const KEYBOARD_LAYOUTS: Record<KeyboardLayoutId, KeyboardLayout> = {
  letterboard: LETTERBOARD_LAYOUT,
  qwerty: QWERTY_LAYOUT,
};

export const DEFAULT_LAYOUT_ID: KeyboardLayoutId = 'letterboard';

export const keyboardLayoutOptions = Object.values(KEYBOARD_LAYOUTS).map((layout) => ({
  id: layout.id,
  label: layout.name,
  description: layout.description,
}));

export const getKeyboardLayout = (id: KeyboardLayoutId): KeyboardLayout =>
  KEYBOARD_LAYOUTS[id] ?? LETTERBOARD_LAYOUT;

