import type { MouseEvent } from "react";
import { cx } from "@/lib/classes";
import { locales, type Locale } from "@/content/types";
import { localeHref } from "@/lib/router";
import styles from "./LangSwitch.module.css";

interface LangSwitchProps {
  current: Locale;
  label: string;
  onChange: (locale: Locale) => void;
}

/** RU / EN — настоящие ссылки на языковой адрес, а не подмена текста на месте.
 *  У каждого языка свой URL, поэтому обе версии индексируются и их можно
 *  отправить ссылкой; обычный клик при этом переключает язык без перезагрузки. */
export function LangSwitch({ current, label, onChange }: LangSwitchProps) {
  const handleClick = (locale: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
    // Клик с Ctrl/⌘/Shift и средней кнопкой оставляем браузеру: человек просит
    // открыть вторую версию в новой вкладке, а не переключить текущую.
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;

    event.preventDefault();
    onChange(locale);
  };

  return (
    <div className={styles.group} role="group" aria-label={label}>
      {locales.map((locale, i) => (
        <span key={locale} className={styles.slot}>
          {i > 0 && <span className={styles.divider}>/</span>}
          {locale === current ? (
            <span className={cx(styles.item, styles.active)} aria-current="true">
              {locale.toUpperCase()}
            </span>
          ) : (
            <a
              href={localeHref(locale)}
              hrefLang={locale}
              className={styles.item}
              onClick={handleClick(locale)}
            >
              {locale.toUpperCase()}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
