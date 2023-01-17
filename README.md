
# PowerQuest FMOD

An FMOD Audio extension for PowerQuest that offers useful features for audio events, transitions, and one-shot sound effects.

Accessible through Quest Scripts using ```AudioEx.``` and through other scripts using the static functions from ```SystemFMOD.```

## Installation

Make sure you have installed and configured [FMOD for Unity](https://www.fmod.com/unity) before using this extension.

After downloading and importing the [Unity Package](https://github.com/joseph-riches/powerquest-fmod/raw/main/PowerQuestFMOD.unitypackage), make the following changes to your ```GlobalScript.cs``` file:

```cs
public void OnGameStart()
{
    SystemFMOD.Get.OnGameStart();
} 

public void OnEnterRoom()
{
    SystemFMOD.Get.OnEnterRoom();
}

public void OnPostRestore(int version)
{
    SystemFMOD.Get.OnPostRestore();
}
```

Then, make the following changes to your ```PowerQuestSave.cs``` file:

```cs
public bool Save(int slot, string description, Texture2D imageOverride = null)
{
    ...
    // Add this underneath Line 103
    data.Add("FMOD", SystemFMOD.Get.GetSaveData());
    ...
} 
```

```cs
public bool RestoreSave(int slot)
{
    ...
    // Add this underneath Line 251
    {
        string name = "FMOD";
        if (data.ContainsKey(name))
            SystemFMOD.Get.RestoreSaveData(data[name]);
    }
    ...
} 

```
*Note: I'd like to avoid making modifications to PowerQuest code, as this means you'll need to make these changes each time an update for PowerQuest is released. Unfortunately, I've encountered an issue with the CustomSaveData system not functioning optimally in my current setup. I apologize for the inconvenience and plan to release a more streamlined version in the future.*

## Project Setup

Create a RoomAudioData SerializedObject for each room.

![Create RoomAudioData Objects](https://s9.gifyu.com/images/CreateRoomAudioData.gif) 

Add FMOD Events to the Audio Events List, add any Parameters to the events and check play on load if needed.

![Assigning Events](https://s9.gifyu.com/images/SetUpEvents.gif) 

Drag the RoomAudioData SerializedObject into the Audio Data property on the specific Room prefab, i.e RoomTitle

![Assigning Data Property](https://s3.gifyu.com/images/AssignRoomDataProperty.gif) 

Create a RoomAudioDataRegistry SerializedObject in the Resources folder, create it at Assets/Resources if you don't already have one.

![Create RoomAudioDataRegistry Object](https://s9.gifyu.com/images/CreateRegistry.gif) 

Click the Autofill Descriptor List button to populate the registry.

![Autofill Descriptor List](https://s9.gifyu.com/images/AutofillDescriptors.gif) 


## Usage

Using the extension can be broken down into two main parts, room audio (such as background music and ambiance), and sound effects.

### Room Audio Data

The extension will automatically create and manage events if you have set up your RoomAudioData SerializedObjects and RoomAudioDataRegistry.

When entering a room, the extension will load the RoomAudioData for that room, stop any events that are not included in the data, update event parameters for events already in the data, and create and play any remaining events.

This allows for smooth music transitions between rooms if your FMOD tracks are set up to transition based on these parameters.

### Sound Effects

```cs
PlayOneShot(string eventReference, Vector3 position = new Vector3())
```

```cs
PlayOneShot(EventReference eventReference, Vector3 position = new Vector3())
```

```cs
PlayOneShot(string eventReference, Vector3 position = new Vector3(), params (string name, float value)[] parameters)
```

The PlayOneShot method immediately creates, plays and releases an instance of an FMOD Event. You can optionally include a Vector3 which will create the event instance at the specific location.

```cs
AudioEx.PlayOneShot("event:/SFX/Forest/enter_dark_cave");
yield return E.Wait(1.0f);
AudioEx.PlayOneShot("event:/SFX/Cave/monster_scuttle", C.Monster.Position);
```

You can optionally include Parameters when calling PlayOneShot, these will be assigned when the instance is created. Playing one shots with this method looks like this:

```cs
AudioEx.PlayOneShot("event:/SFX/Cave/monster_growl", C.Monster.Position, ("Reverb", 1.50f), ("Pitch", 0.5f));
```

## Optional: Static Event References

### Description

The optional [CreateQuestScriptAutos.js](https://github.com/joseph-riches/powerquest-fmod/raw/main/CreateQuestScriptAutos.js) script for FMOD Studio generates static references for selected events in your FMOD project. This simplifies calls within your PowerQuest project, but keep in mind that the file will need to be regenerated when new events are added in FMOD.

Here's the generated output, based on the examples above:

```cs
namespace PowerScript
{
	public static partial class S
	{
		public static string EnterDarkCave = "event:/SFX/Forest/enter_dark_cave";

		public static string MonsterScuttle = "event:/SFX/Cave/monster_scuttle";

		public static string MonsterGrowl = "event:/SFX/Cave/monster_growl";
	}
}
```

And this is how that new static ```S.``` class would be used:


```cs
AudioEx.PlayOneShot(S.EnterDarkCave);
yield return E.Wait(1.0f);
AudioEx.PlayOneShot(S.MonsterScuttle, C.Monster.Position);
yield return C.Dave.Say("Did something just move?");
AudioEx.PlayOneShot(S.MonsterGrowl, C.Monster.Position, ("Reverb", 1.50f), ("Pitch", 0.5f));
```

### Installation

To use the script, please refer to the FMOD Studio documentation on [Script Files](https://www.fmod.com/docs/2.00/studio/scripting-terminal-reference.html#script-files) for the proper placement of the script. Then, select the events you wish to include (ensuring not to select any folders) and navigate to Scripts > Unity > GenerateQuestScriptAutos.

![GenerateQuestScriptAutos](https://s9.gifyu.com/images/CreateQuestScriptAutos.gif) 

This will generate a file named ```QuestScriptAutosExtenstion.cs``` in the Scripts folder of the FMOD Studio project's root directory. To use it in Unity, simply import this folder into your Unity project.
