import { useTranslation } from "react-i18next";

export function FanProjectFooter() {
  const { t } = useTranslation("interface");

  return (
    <footer
      aria-label={t("fanProjectFooter.label")}
      className="fan-project-footer"
    >
      <p>{t("fanProjectFooter.creator")}</p>
      <p>{t("fanProjectFooter.affiliation")}</p>
      <p>{t("fanProjectFooter.rights")}</p>
      <p>{t("fanProjectFooter.credits")}</p>
    </footer>
  );
}
