import json


async def upgrade_user_do(message, data):
    tmp = await read_user_status(message)
    tmp["do"] = data
    await write_user_status(message,tmp)


async def upgrade_img_count_status(message, data):
    tmp = await read_user_status(message)
    tmp["count_img"] = data
    await write_user_status(message,tmp)


async def get_user_do(message):
    tmp = await read_user_status(message)
    return tmp["do"]


async def get_count_status(message):
    tmp = await read_user_status(message)
    return bool(tmp["count_img"])


async def write_user_status(message, data):
    path = f"users/{message.from_user.id}/status.txt"
    with open(path, "w", encoding="UTF-8") as file:
        file.write(json.dumps(data))


async def read_user_status(message):
    path = f"users/{message.from_user.id}/status.txt"
    with open(path, "r", encoding="UTF-8") as file:
        result = json.loads(file.read())
    return result


async def set_default_status(message):
    await write_user_status(message, {"do": "none", "count_img":False,"effect_level":"none","speed":"none"})
