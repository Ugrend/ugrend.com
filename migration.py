import psycopg2
import psycopg2.extras
import json

old_pats_db_uri = "host=%s port=%s dbname=%s user=%s" % ("localhost", 5433, "pats", "postgres")
new_pats = "host=%s dbname=%s user=%s" % ("localhost", "ugrendcom", "postgres")



old_pats_conn = psycopg2.connect(old_pats_db_uri)
new_pats_conn = psycopg2.connect(new_pats)

with open("./pats.json" , 'rb') as f:
    parsed_config = json.load(f)

EMOTE_CACHE={}

with new_pats_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as c:
    c.execute("SELECT * FROM emote")
    for r in c.fetchall():
        EMOTE_CACHE[r['name']] = r['id']

def lookup_user_old(player_id: int):
    with old_pats_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
        cursor.execute("SELECT * FROM player WHERE id = %s", (player_id,))
        return cursor.fetchone()

def lookup_user_new(player_name: str, server: str):
    with new_pats_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
        cursor.execute("SELECT * FROM player WHERE name = %s and server = %s", (player_name, server))
        return cursor.fetchone()

def create_player_new(name: str, server: str, lodestone_id: int, avatar_uri: str):
    with new_pats_conn.cursor() as cursor:
        cursor.execute("INSERT INTO player (name, server, loadstone_id, avatar_uri) VALUES (%s,%s,%s,%s) RETURNING *", (name, server, lodestone_id, avatar_uri))
        new_pats_conn.commit()
        return cursor.fetchone()



def migrate_player(player_id: int):
    old_player = lookup_user_old(player_id)
    if old_player:
        new_player = lookup_user_new(old_player["name"], old_player["server"])
        if not new_player:
            new_player = create_player_new(old_player["name"], old_player["server"], old_player["lodestone_id"], old_player["avatar_uri"])
        return new_player

def migrate_emote(emote: str, source_new_player_id: int, target_new_player_id: int, count: int):
    emote_id = EMOTE_CACHE[emote]
    with new_pats_conn.cursor() as cursor:
        cursor.execute("INSERT INTO emote_count_source (emote_id, pat_player_id, source_player_id, count) VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING", (emote_id, target_new_player_id, source_new_player_id, count))
        new_pats_conn.commit()

def migrate():
    for k,v in parsed_config.items():
        new_target = migrate_player(k)
        for pk, pv in v["players"].items():
            source_new = migrate_player(pk)
            if source_new and new_target:
                for emote, count in pv.items():
                    emote = emote.lower()
                    if "pat" in emote:
                        migrate_emote("pat", source_new["id"], new_target["id"], count)
                    if "slap" in emote:
                        migrate_emote("slap", source_new["id"], new_target["id"], count)
                    if "hug" in emote:
                        migrate_emote("hug", source_new["id"], new_target["id"], count)
                    if "dote" in emote:
                        migrate_emote("dote", source_new["id"], new_target["id"], count)



if __name__ == "__main__":
    migrate()       
