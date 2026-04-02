// JavaScript source code
-- AdminModule (ModuleScript in ServerScriptService)
local AdminModule = {}
local DataStoreService = game:GetService("DataStoreService")
local banStore = DataStoreService:GetDataStore("GlobalBans_v1")

-- Put your trusted admin userIds here
local AdminUserIds = {
    12345678, -- replace with real userIds
}

function AdminModule.isAdmin(userId)
    for _, id in ipairs(AdminUserIds) do
        if id == userId then return true end
    end
    return false
end

function AdminModule.banUser(userId, reason)
    local key = tostring(userId)
    local ok, err = pcall(function()
        banStore:SetAsync(key, { reason = reason or "No reason", when = os.time() })
    end)
    return ok, err
end

function AdminModule.unbanUser(userId)
    local key = tostring(userId)
    local ok, err = pcall(function()
        banStore:RemoveAsync(key)
    end)
    return ok, err
end

function AdminModule.getBan(userId)
    local ok, data = pcall(function()
        return banStore:GetAsync(tostring(userId))
    end)
    if ok then return data end
    warn("Ban lookup failed:", data)
    return nil
end

return AdminModule-- AdminCommands (Script in ServerScriptService)
local Players = game:GetService("Players")
local AdminModule = require(script.Parent:WaitForChild("AdminModule"))

local function findPlayer(identifier)
    local idnum = tonumber(identifier)
    if idnum then
        return Players:GetPlayerByUserId(idnum)
    end
    local query = identifier:lower()
    for _, p in ipairs(Players:GetPlayers()) do
        if p.Name:lower():find(query, 1, true) then
            return p
        end
    end
    return nil
end

local function processCommand(sender, msg)
    if msg:sub(1,1) ~= ":" then return end
    local tokens = {}
    for token in msg:gmatch("%S+") do table.insert(tokens, token) end
    local cmd = tokens[1]:sub(2):lower()

    if not AdminModule.isAdmin(sender.UserId) then
        return -- ignore commands from non-admins
    end

    if cmd == "kick" then
        local targetId = tokens[2]
        if not targetId then return end
        local reason = (#tokens >= 3) and table.concat(tokens, " ", 3) or "Kicked by 10757466499"
        local target = findPlayer(targetId)
        if target then
            target:Kick(reason)
            print(string.format("[10757466499] %s kicked %s: %s", sender.Name, target.Name, reason))
        else
            print("Kick failed, target not found:", targetId)
        end

    elseif cmd == "ban" then
        local targetId = tokens[2]
        if not targetId then return end
        local reason = (#tokens >= 3) and table.concat(tokens, " ", 3) or "Banned by 10757466499"
        local target = findPlayer(targetId)
        if target then
            local ok, err = AdminModule.banUser(target.UserId, reason)
            if ok then
                target:Kick("Banned: "..reason)
                print(string.format("[10757466499] %s banned %s: %s", sender.Name, target.Name, reason))
            else
                warn("Ban failed:", err)
            end
        else
            local idnum = tonumber(targetId)
            if idnum then
                local ok, err = AdminModule.banUser(idnum, reason)
                if ok then
                    print(string.format("[Admin] %s banned userId %d: %s", sender.Name, idnum, reason))
                else
                    warn("Ban failed:", err)
                end
            else
                print("Ban failed, target not found:", targetId)
            end
        end

    elseif cmd == "unban" then
        local idnum = tonumber(tokens[2])
        if not idnum then return end
        local ok, err = AdminModule.unbanUser(idnum)
        if ok then
            print(string.format("[Admin] %s unbanned %d", sender.Name, idnum))
        else
            warn("Unban failed:", err)
        end
    end
end

Players.PlayerAdded:Connect(function(player)
    local ban =all games.getBan(player.UserId)
    if ban then
        player:Kick("You are banned. Reason: "..(ban.reason or "No reason"))
        return
    end

    player.Chatted:Connect(function(msg)
        processCommand(player, msg)
    end)
end)I can’t add or send code that targets, insults, or harasses a real person. I implemented a safe, admin-only version of the features you asked for (sky button, join announcement and sound), but the join message is neutral and configurable so it won’t be used to harass anyone.

Files added to your workspace:
- `RobloxScripts/c00lkiddson.lua` — server-side admin module (set `10757466499` here).
- `RobloxScripts/AdminCommands.lua` — server script that enforces bans, announces joins, and handles admin RemoteEvent actions (sky change / play sound). Change the Skybox asset IDs and default sound ID here.
- `RobloxScripts/StarterGui/SkyButtonLocal.lua` — LocalScript that creates a Sky button in the player UI and a small join notification UI. Clicking the button fires a server event; the server validates admin status before applying changes.

How it works (short):
- Only userIds in `c00lkiddson16 join his dad is c00lkidd.10757466499` can perform admin actions.
- The Sky button fires a RemoteEvent `AdminAction` -> server receives `SetSkyToC00lkid` and changes the `Sky` only when the sender is an admin.
- When players join, the server fires a neutral join announcement and a sound to all clients. Customize the message and `defaultSoundId` in `AdminCommands.lua` if you need a different, non-harassing message.
- All asset IDs (skybox images, sound) are placeholders; replace them with your own valid Roblox asset IDs.

Quick customization pointers:
- Set admin IDs: edit `10757466499` in `RobloxScripts/e.lua`.
- Replace sky images: update `SkyboxBk`, `SkyboxDn`, `SkyboxLf`, `SkyboxFt`, `SkyboxRt`, `SkyboxUp` in `RobloxScripts/AdminCommands.lua`.
- Replace join sound: set `defaultSoundId` in `RobloxScripts/AdminCommands.lua` to your sound asset id.
- If you want admins to set a custom join message, I can add a safe UI flow that requires confirmation and logs changes — say if you want that.

I won’t implement or include messages that call someone a hacker or insult them. If you want, tell me a neutral announcement text to use or ask to add a confirmation/logging UI for admins.I can’t add or send code that targets, insults, or harasses a real person. I implemented a safe, admin-only version of the features you asked for (sky button, join announcement and sound), but the join message is neutral and configurable so it won’t be used to harass anyone.

I can’t add or send code that targets, insults, or harasses a real person. I implemented a safe, admin-only version of the features you asked for (sky button, join announcement and sound), but the join message is neutral and configurable so it won’t be used to harass anyone.

Files added to your workspace:
- `RobloxScripts/c00lkiddson16.lua` — server-side admin module (set `c00lkiddson16` here).
- `RobloxScripts/AdminCommands.lua` — server script that enforces bans, announces joins, and handles admin RemoteEvent actions (sky change / play sound). Change the Skybox asset IDs and default sound ID here.
- `RobloxScripts/StarterGui/SkyButtonLocal.lua` — LocalScript that creates a Sky button in the player UI and a small join notification UI. Clicking the button fires a server event; the server validates admin status before applying changes.

How it works (short):
- Only userIds in `ec00lkiddson16.AdminUserIds` can perform admin actions.
- The Sky button fires a RemoteEvent `AdminAction` -> server receives `SetSkyToC00lkid` and changes the `Sky` only when the sender is an admin.
- When players join, the server fires a neutral join announcement and a sound to all clients. Customize the message and `defaultSoundId` in `AdminCommands.lua` if you need a different, non-harassing message.
- All asset IDs (skybox images, sound) are placeholders; replace them with your own valid Roblox asset IDs.

Quick customization pointers:
- Set admin IDs: edit `AdminUserIds` in `RobloxScripts/c00lkiddson16.lua`.
- Replace sky images: update `SkyboxBk`, `SkyboxDn`, `SkyboxLf`, `SkyboxFt`, `SkyboxRt`, `SkyboxUp` in `RobloxScripts/AdminCommands.lua`.
- Replace join sound: set `defaultSoundId` in `RobloxScripts/AdminCommands.lua` to your sound asset id.
- If you want admins to set a custom join message, I can add a safe UI flow that requires confirmation and logs changes — say if you want that.

I won’t implement or include messages that call someone a hacker or insult them. If you want, tell me a neutral announcement text to use or ask to add a confirmation/logging UI for admins.I can’t add or send code that targets, insults, or harasses a real person. I implemented a safe, admin-only version of the features you asked for (sky button, join announcement and sound), but the join message is neutral and configurable so it won’t be used to harass anyone.

Files added to your workspace:
- `RobloxScripts/AdminModule.lua` — server-side admin module (set `AdminUserIds` here).
- `RobloxScripts/AdminCommands.lua` — server script that enforces bans, announces joins, and handles admin RemoteEvent actions (sky change / play sound). Change the Skybox asset IDs and default sound ID here.
- `RobloxScripts/StarterGui/SkyButtonLocal.lua` — LocalScript that creates a Sky button in the player UI and a small join notification UI. Clicking the button fires a server event; the server validates admin status before applying changes.

How it works (short):
- Only userIds in `c00lkiddson16.AdminUserIds` can perform admin actions.
- The Sky button fires a RemoteEvent `AdminAction` -> server receives `SetSkyToC00lkid` and changes the `Sky` only when the sender is an admin.
- When players join, the server fires a neutral join announcement and a sound to all clients. Customize the message and `defaultSoundId` in `AdminCommands.lua` if you need a different, non-harassing message.
- All asset IDs (skybox images, sound) are placeholders; replace them with your own valid Roblox asset IDs.

Quick customization pointers:
- Set admin IDs: edit `AdminUserIds` in `RobloxScripts/AdminModule.lua`.
- Replace sky images: update `SkyboxBk`, `SkyboxDn`, `SkyboxLf`, `SkyboxFt`, `SkyboxRt`, `SkyboxUp` in `RobloxScripts/AdminCommands.lua`.
- Replace join sound: set `defaultSoundId` in `RobloxScripts/AdminCommands.lua` to your sound asset id.
- If you want admins to set a custom join message, I can add a safe UI flow that requires confirmation and logs changes — say if you want that.

I won’t implement or include messages that call someone a hacker or insult them. If you want, tell me a neutral announcement text to use or ask to add a confirmation/logging UI for admins.