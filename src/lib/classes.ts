/** CSS Modules are typed with an index signature, so under
 *  `noUncheckedIndexedAccess` every `styles.foo` lookup is `string | undefined`.
 *  These two helpers absorb that in one place rather than sprinkling `!` around
 *  or dropping the compiler flag. */

/** Joins class names, dropping anything falsy. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** classList.toggle throws on an empty string, so a missing class is a no-op. */
export function toggleClass(node: Element, name: string | undefined, on: boolean): void {
  if (name) node.classList.toggle(name, on);
}

/** Same guard for add/remove pairs. */
export function setClass(node: Element, name: string | undefined, on: boolean): void {
  if (!name) return;
  if (on) node.classList.add(name);
  else node.classList.remove(name);
}
