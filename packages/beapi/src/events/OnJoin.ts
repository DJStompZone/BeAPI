// Normal imports.
import AbstractEvent from './AbstractEvent'
import { setProto } from '../'
import { PlayerJoinEvent, world } from 'mojang-minecraft'

// Type imports.
import type { Client } from '../client'

/**
 * BeAPI join event. Contains the logic
 * for translating Minecraft event data to BeAPI
 * wrapped data.
 */
export class OnJoin extends AbstractEvent {
  // Predefined in AbstractEvent.
  protected readonly _logic = this.__logic.bind(this)
  // Predefined in AbstractEvent.
  protected readonly _client: Client
  // Predefined in AbstractEvent.
  protected _registered = false

  // Predefined in AbstractEvent.
  @setProto('OnJoin')
  public readonly name = 'OnJoin'

  // Predefined in AbstractEvent.
  @setProto('playerJoin')
  public readonly iName = 'playerJoin'

  // Predefined in AbstractEvent.
  public readonly alwaysCancel = false

  /**
   * BeAPI join event. Contains the logic
   * for translating Minecraft event data to BeAPI
   * wrapped data.
   * @param client Client referece.
   */
  public constructor(client: Client) {
    super()
    this._client = client
  }

  // Predefined in AbstractEvent.
  public on(): void {
    // If not already registered.
    if (!this._registered) {
      // Subscribe to Minecraft world event with IName
      // And use bound _logic for the callback.
      world.events[this.iName].subscribe(this._logic)
      // Set registered to true so this cannot be called
      // Again before off being called.
      this._registered = true
    }
  }

  // Predefined in AbstractEvent.
  public off(): void {
    // If currently registered.
    if (this._registered) {
      // Remove Minecraft event listener on IName
      // With bound _logic callback.
      world.events[this.iName].unsubscribe(this._logic)
      // Set registered to false so this cannot be called
      // Again before on being called.
      this._registered = false
    }
  }

  // Predefined in AbstractEvent.
  protected __logic(arg: PlayerJoinEvent): void {
    // Create a player from the IPlayer object.
    const player = this._client.players.create(arg.player)
    // Add the player to player manager.
    this._client.players.add(player)
    // Emit the new player.
    this._client.emit(this.name, player)
  }
}
