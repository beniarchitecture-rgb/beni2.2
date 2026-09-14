import { siteConfig } from "@/data/siteConfig";
import { t } from "@/lib/i18n";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AgencyPage({ lang }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12" data-testid="page-agency">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" data-testid="agency-title">
            {t(lang, "nav.agency")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground" data-testid="agency-subtitle">
            {siteConfig.brand.name} — {siteConfig.brand.registration}
          </p>
        </div>
        <Badge variant="secondary" data-testid="agency-badge">
          {siteConfig.brand.yearFounded}
        </Badge>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2" data-testid="agency-cards">
        <Card data-testid="agency-card-history">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Historique</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Créée en {siteConfig.brand.yearFounded}, {siteConfig.brand.name} accompagne investisseurs,
            institutions et acteurs privés sur des projets institutionnels, résidentiels et
            commerciaux.
          </CardContent>
        </Card>

        <Card data-testid="agency-card-team">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Équipe</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Une équipe pluridisciplinaire de plus de 10 personnes (architectes, ingénieurs, techniciens)
            pour couvrir l’étude, la conception, l’exécution et le suivi.
          </CardContent>
        </Card>

        <Card data-testid="agency-card-vision">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t(lang, "sections.visionTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t(lang, "sections.visionText")}
          </CardContent>
        </Card>

        <Card data-testid="agency-card-mission">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Concevoir des espaces sobres, pérennes et identitaires, combinant rigueur technique,
            élégance contemporaine et ancrage culturel.
          </CardContent>
        </Card>
      </div>

      <div className="mt-10" data-testid="agency-footer-note">
        <p className="text-xs text-muted-foreground">
          Remarque : les textes sont modifiables facilement via <code>src/data/siteConfig.js</code>.
        </p>
      </div>
    </div>
  );
}
