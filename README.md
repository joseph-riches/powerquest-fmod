
# PowerQuest FMOD

An FMOD Audio extension for PowerQuest that offers useful features for audio events, transitions, and one-shot sound effects.

Accessible through Quest Scripts using 'AudioExt.' and through other scripts using the static functions from 'SystemFMOD.'

## Installation

Make sure you have installed and configured [FMOD for Unity](https://www.fmod.com/unity) before using this extension.

After downloading and importing the [Unity Package](https://github.com/joseph-riches/powerquest-fmod/raw/master/PowerQuestFMOD.unitypackage), make the following changes to your GlobalScript.cs file:

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

Then, make the following changes to your PowerQuestSave.cs file:

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

If you have set up your RoomAudioData SerializedObjects, and the RoomAudioDataRegistry, then events will be automatically created and managed by the extension.

In OnEnterRoom, the extension will load the RoomAudioData for the current room and stop any events playing that aren't included in that data. Then they system will identify and events that are already in the data, and update the event parameters instead of creating a new event instance. Finally, the system will create and play any remaining events.

If you set up your FMOD tracks to transition based on these parameters, this means that you can have smooth music transitions between rooms.

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
