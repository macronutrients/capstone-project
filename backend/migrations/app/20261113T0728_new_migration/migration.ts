#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2f615da72cc3d5bf4f17e22a875b35500d68675b95d49dfac05a3fb4a4ff6397/contract';
import endContract from '../../snapshots/2f615da72cc3d5bf4f17e22a875b35500d68675b95d49dfac05a3fb4a4ff6397/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c16c2fbe768bc57b97902284060507eb5e29b132b5bbed20875a809334cb752a/contract';
import startContract from '../../snapshots/c16c2fbe768bc57b97902284060507eb5e29b132b5bbed20875a809334cb752a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('lastStreakDate', 'timestamp(3)', {
          codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('streak', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
