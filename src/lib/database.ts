import postgres from "postgres";

export type DataSourceMode = "demo" | "postgres";

export type DatabaseStatus = {
  mode: DataSourceMode;
  configured: boolean;
  label: string;
  message: string;
};

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

export function getDataSourceMode(): DataSourceMode {
  return process.env.DATA_SOURCE === "postgres" ? "postgres" : "demo";
}

function maskDatabaseUrl(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}${url.pathname}`;
  } catch {
    return "DATABASE_URL";
  }
}

export function getDatabaseStatus(): DatabaseStatus {
  const mode = getDataSourceMode();
  const databaseUrl = getDatabaseUrl();

  if (mode === "demo") {
    return {
      mode,
      configured: false,
      label: "Demo Store",
      message: "Veriler .demo-data içinde dosya tabanlı tutuluyor.",
    };
  }

  if (!databaseUrl) {
    return {
      mode,
      configured: false,
      label: "PostgreSQL",
      message: "DATA_SOURCE=postgres için DATABASE_URL tanımlanmalı.",
    };
  }

  return {
    mode,
    configured: true,
    label: "PostgreSQL",
    message: `${maskDatabaseUrl(databaseUrl)} bağlantısı yapılandırıldı.`,
  };
}

export async function pingDatabase() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return {
      ok: false,
      message: "DATABASE_URL tanımlı değil.",
    };
  }

  const sql = postgres(databaseUrl, {
    connect_timeout: 5,
    idle_timeout: 5,
    max: 1,
  });

  try {
    await sql`select 1`;
    return {
      ok: true,
      message: "Database bağlantısı başarılı.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Database bağlantısı kurulamadı.",
    };
  } finally {
    await sql.end({ timeout: 1 });
  }
}
