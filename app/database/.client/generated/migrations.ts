export default [
  {
    "statements": [
      "CREATE TABLE \"post\" (\n  \"id\" TEXT NOT NULL,\n  \"title\" TEXT NOT NULL,\n  \"creator_id\" TEXT,\n  CONSTRAINT \"post_pkey\" PRIMARY KEY (\"id\")\n) WITHOUT ROWID;\n",
      "INSERT OR IGNORE INTO _electric_trigger_settings (namespace, tablename, flag) VALUES ('main', 'post', 1);",
      "DROP TRIGGER IF EXISTS update_ensure_main_post_primarykey;",
      "CREATE TRIGGER update_ensure_main_post_primarykey\n  BEFORE UPDATE ON \"main\".\"post\"\nBEGIN\n  SELECT\n    CASE\n      WHEN old.\"id\" != new.\"id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column id as it belongs to the primary key')\n    END;\nEND;",
      "DROP TRIGGER IF EXISTS insert_main_post_into_oplog;",
      "CREATE TRIGGER insert_main_post_into_oplog\n   AFTER INSERT ON \"main\".\"post\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'post')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'post', 'INSERT', json_patch('{}', json_object('id', new.\"id\")), json_object('creator_id', new.\"creator_id\", 'id', new.\"id\", 'title', new.\"title\"), NULL, NULL);\nEND;",
      "DROP TRIGGER IF EXISTS update_main_post_into_oplog;",
      "CREATE TRIGGER update_main_post_into_oplog\n   AFTER UPDATE ON \"main\".\"post\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'post')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'post', 'UPDATE', json_patch('{}', json_object('id', new.\"id\")), json_object('creator_id', new.\"creator_id\", 'id', new.\"id\", 'title', new.\"title\"), json_object('creator_id', old.\"creator_id\", 'id', old.\"id\", 'title', old.\"title\"), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS delete_main_post_into_oplog;",
      "CREATE TRIGGER delete_main_post_into_oplog\n   AFTER DELETE ON \"main\".\"post\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'post')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'post', 'DELETE', json_patch('{}', json_object('id', old.\"id\")), NULL, json_object('creator_id', old.\"creator_id\", 'id', old.\"id\", 'title', old.\"title\"), NULL);\nEND;"
    ],
    "version": "20240516110305_756"
  }
]