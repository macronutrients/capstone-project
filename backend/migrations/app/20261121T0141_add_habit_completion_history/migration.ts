#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2575324676d4648021d5116a7aaecdeb2770bd1c16fcabeaf481a4cccc3505da/contract';
import endContract from '../../snapshots/2575324676d4648021d5116a7aaecdeb2770bd1c16fcabeaf481a4cccc3505da/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/2f615da72cc3d5bf4f17e22a875b35500d68675b95d49dfac05a3fb4a4ff6397/contract';
import startContract from '../../snapshots/2f615da72cc3d5bf4f17e22a875b35500d68675b95d49dfac05a3fb4a4ff6397/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'HabitCompletion',
        columns: [
          col('date', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('habitId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HabitCompletion',
        index: 'HabitCompletion_habitId_date_key',
        columns: ['habitId', 'date'],
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'HabitCompletion',
        foreignKey: {
          name: 'HabitCompletion_habitId_fkey',
          columns: ['habitId'],
          references: { schema: 'public', table: 'Habit', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
