import { siteConfig } from "@/data/siteConfig";
import { t } from "@/lib/i18n";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ServicesPage({ lang }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12" data-testid="page-services">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" data-testid="services-title">
            {t(lang, "nav.services")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground" data-testid="services-subtitle">
            Des missions sur mesure : de l’étude à la réalisation.
          </p>
        </div>
        <Badge variant="outline" data-testid="services-badge">
          {siteConfig.expertise.length} domaines
        </Badge>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="services-grid">
        {siteConfig.expertise.map((s) => (
          <Card key={s.key} data-testid={`service-card-${s.key}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base" data-testid={`service-title-${s.key}`}>
                {lang === "en" ? s.en : s.fr}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground" data-testid={`service-desc-${s.key}`}>
              Mission structurée, coordination, et livrables clairs (plans, prescriptions, suivi).
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
