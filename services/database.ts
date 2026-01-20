
// @ts-ignore
const initSqlJs = window.initSqlJs;

export class Conexion {
  private static db: any = null;
  private static STORAGE_KEY = 'sqlite_pacientes_db';

  static async getDB() {
    if (this.db) return this.db;

    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    });

    const savedDb = localStorage.getItem(this.STORAGE_KEY);
    if (savedDb) {
      const u8array = new Uint8Array(JSON.parse(savedDb));
      this.db = new SQL.Database(u8array);
    } else {
      this.db = new SQL.Database();
      this.db.run("CREATE TABLE Pacientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombres TEXT, correo TEXT);");
      this.persist();
    }
    return this.db;
  }

  static persist() {
    if (!this.db) return;
    const data = this.db.export();
    const array = Array.from(data);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(array));
  }

  static async consultarRegistros(query: string, params: any[] = []) {
    const db = await this.getDB();
    const res = db.exec(query, params);
    if (res.length === 0) return [];
    
    const columns = res[0].columns;
    return res[0].values.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((col: string, i: number) => {
        obj[col] = row[i];
      });
      return obj;
    });
  }

  static async ejecutarSentencia(query: string, params: any[] = []) {
    const db = await this.getDB();
    db.run(query, params);
    this.persist();
  }

  static exportFile() {
    if (!this.db) return;
    const data = this.db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pacientes.sqlite';
    a.click();
  }
}
