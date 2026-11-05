"use client";
import type { Chapter } from "@/content/chapter-types";
import { bi as b } from "@/lib/types";
import { useAcademy } from "./provider";
export function TeachingSources({ chapter }: { chapter: Chapter }) {
  const { t } = useAcademy();
  if (!chapter.sources?.length) return null;
  return (
    <section id="teaching-sources" className="teaching-sources">
      <h3>
        {t(
          b("Where the explanation comes from", "İzah hansı mənbəyə əsaslanır"),
        )}
      </h3>
      <p className="small">
        {t(
          b(
            "The lesson synthesizes the concepts in its own words. Official language rules, framework references, design rationale and historical engineering discussion serve different purposes. A discussion link is not a claim that its comments were verified.",
            "Dərs anlayışı öz sözləri ilə sintez edir. Rəsmi dil qaydası, framework istinadı, dizayn səbəbi və tarixi mühəndislik müzakirəsi fərqli məqsədlidir. Müzakirə keçidi comment-lərin yoxlanması iddiası deyil.",
          ),
        )}
      </p>
      {chapter.sources.map((source) => (
        <div className="teaching-source" key={source.id}>
          <div className="flex-between wrap">
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title} ↗
            </a>
            <span
              className={
                "chip " +
                (source.status === "reviewed-source" ? "green" : "warm")
              }
            >
              {t(
                source.status === "reviewed-source"
                  ? b("Source text reviewed", "Mənbə mətni oxunub")
                  : b(
                      "Reading link · not retrieved",
                      "Oxu keçidi · gətirilməyib",
                    ),
              )}
            </span>
          </div>
          <p>{t(source.supports)}</p>
          <details>
            <summary>
              {t(
                b(
                  "Scope and limits of this reference",
                  "İstinadın əhatəsi və sərhədi",
                ),
              )}
            </summary>
            <p>{t(source.qualification)}</p>
            {source.revision && (
              <p className="source-reference">
                {t(b("Pinned source revision: ", "Sabit mənbə revision-u: "))}
                {source.revision.slice(0, 12)}
              </p>
            )}
          </details>
        </div>
      ))}
    </section>
  );
}
