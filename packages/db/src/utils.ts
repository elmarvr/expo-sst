import type { BuildColumns, BuildExtraConfigColumns } from "drizzle-orm";
import {
  PgColumnBuilderBase,
  PgTableExtraConfig,
  PgTableWithColumns,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

export function baseTable<
  TTableName extends string,
  TColumnsMap extends Record<string, PgColumnBuilderBase>,
>(
  name: TTableName,
  columns: TColumnsMap,
  extraConfig?: (
    self: BuildExtraConfigColumns<
      TTableName,
      TColumnsMap & typeof timestampColumns,
      "pg"
    >
  ) => PgTableExtraConfig
): PgTableWithColumns<{
  name: TTableName;
  schema: undefined;
  columns: BuildColumns<
    TTableName,
    TColumnsMap & typeof timestampColumns,
    "pg"
  >;
  dialect: "pg";
}> {
  return pgTable(name, { ...columns, ...timestampColumns }, extraConfig);
}

export const timestampColumns = {
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
} satisfies Record<string, PgColumnBuilderBase>;
