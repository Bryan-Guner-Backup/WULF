/** File: chatUser.js
 * Candy - Chats are not dead yet.
 *
 * Authors:
 *   - Patrick Stadler <patrick.stadler@gmail.com>
 *   - Michael Weibel <michael.weibel@gmail.com>
 *
 * Copyright:
 *   (c) 2011 Amiado Group AG. All rights reserved.
 *   (c) 2012-2014 Patrick Stadler & Michael Weibel. All rights reserved.
 */
"use strict";

/* global Candy, Strophe */

/** Class: Candy.Core.ChatUser
 * Chat User
 */
Candy.Core.ChatUser = function (jid, nick, affiliation, role, realJid) {
  /** Constant: ROLE_MODERATOR
   * Moderator role
   */
  this.ROLE_MODERATOR = "moderator";

  /** Constant: AFFILIATION_OWNER
   * Affiliation owner
   */
  this.AFFILIATION_OWNER = "owner";

  /** Object: data
   * User data containing:
   * - jid
   * - realJid
   * - nick
   * - affiliation
   * - role
   * - privacyLists
   * - customData to be used by e.g. plugins
   */
  this.data = {
    jid: jid,
    realJid: realJid,
    nick: Strophe.unescapeNode(nick),
    affiliation: affiliation,
    role: role,
    privacyLists: {},
    customData: {},
    previousNick: undefined,
  };
};

/** Function: getJid
 * Gets an unescaped user jid
 *
 * See:
 *   <Candy.Util.unescapeJid>
 *
 * Returns:
 *   (String) - jid
 */
Candy.Core.ChatUser.prototype.getJid = function () {
  if (this.data.jid) {
    return Candy.Util.unescapeJid(this.data.jid);
  }
  return;
};

/** Function: getEscapedJid
 * Escapes the user's jid (node & resource get escaped)
 *
 * See:
 *   <Candy.Util.escapeJid>
 *
 * Returns:
 *   (String) - escaped jid
 */
Candy.Core.ChatUser.prototype.getEscapedJid = function () {
  return Candy.Util.escapeJid(this.data.jid);
};

/** Function: setJid
 * Sets a user's jid
 *
 * Parameters:
 *   (String) jid - New Jid
 */
Candy.Core.ChatUser.prototype.setJid = function (jid) {
  this.data.jid = jid;
};

/** Function: getRealJid
 * Gets an unescaped real jid if known
 *
 * See:
 *   <Candy.Util.unescapeJid>
 *
 * Returns:
 *   (String) - realJid
 */
Candy.Core.ChatUser.prototype.getRealJid = function () {
  if (this.data.realJid) {
    return Candy.Util.unescapeJid(this.data.realJid);
  }
  return;
};

/** Function: getNick
 * Gets user nick
 *
 * Returns:
 *   (String) - nick
 */
Candy.Core.ChatUser.prototype.getNick = function () {
  return Strophe.unescapeNode(this.data.nick);
};

/** Function: setNick
 * Sets a user's nick
 *
 * Parameters:
 *   (String) nick - New nick
 */
Candy.Core.ChatUser.prototype.setNick = function (nick) {
  this.data.nick = nick;
};

/** Function: getRole
 * Gets user role
 *
 * Returns:
 *   (String) - role
 */
Candy.Core.ChatUser.prototype.getRole = function () {
  return this.data.role;
};

/** Function: setRole
 * Sets user role
 *
 * Parameters:
 *   (String) role - Role
 */
Candy.Core.ChatUser.prototype.setRole = function (role) {
  this.data.role = role;
};

/** Function: setAffiliation
 * Sets user affiliation
 *
 * Parameters:
 *   (String) affiliation - new affiliation
 */
Candy.Core.ChatUser.prototype.setAffiliation = function (affiliation) {
  this.data.affiliation = affiliation;
};

/** Function: getAffiliation
 * Gets user affiliation
 *
 * Returns:
 *   (String) - affiliation
 */
Candy.Core.ChatUser.prototype.getAffiliation = function () {
  return this.data.affiliation;
};

/** Function: isModerator
 * Check if user is moderator. Depends on the room.
 *
 * Returns:
 *   (Boolean) - true if user has role moderator or affiliation owner
 */
Candy.Core.ChatUser.prototype.isModerator = function () {
  return (
    this.getRole() === this.ROLE_MODERATOR ||
    this.getAffiliation() === this.AFFILIATION_OWNER
  );
};

/** Function: addToOrRemoveFromPrivacyList
 * Convenience function for adding/removing users from ignore list.
 *
 * Check if user is already in privacy list. If yes, remove it. If no, add it.
 *
 * Parameters:
 *   (String) list - To which privacy list the user should be added / removed from. Candy supports curently only the "ignore" list.
 *   (String) jid  - User jid to add/remove
 *
 * Returns:
 *   (Array) - Current privacy list.
 */
Candy.Core.ChatUser.prototype.addToOrRemoveFromPrivacyList = function (
  list,
  jid
) {
  if (!this.data.privacyLists[list]) {
    this.data.privacyLists[list] = [];
  }
  var index = -1;
  if ((index = this.data.privacyLists[list].indexOf(jid)) !== -1) {
    this.data.privacyLists[list].splice(index, 1);
  } else {
    this.data.privacyLists[list].push(jid);
  }
  return this.data.privacyLists[list];
};

/** Function: getPrivacyList
 * Returns the privacy list of the listname of the param.
 *
 * Parameters:
 *   (String) list - To which privacy list the user should be added / removed from. Candy supports curently only the "ignore" list.
 *
 * Returns:
 *   (Array) - Privacy List
 */
Candy.Core.ChatUser.prototype.getPrivacyList = function (list) {
  if (!this.data.privacyLists[list]) {
    this.data.privacyLists[list] = [];
  }
  return this.data.privacyLists[list];
};

/** Function: setPrivacyLists
 * Sets privacy lists.
 *
 * Parameters:
 *   (Object) lists - List object
 */
Candy.Core.ChatUser.prototype.setPrivacyLists = function (lists) {
  this.data.privacyLists = lists;
};

/** Function: isInPrivacyList
 * Tests if this user ignores the user provided by jid.
 *
 * Parameters:
 *   (String) list - Privacy list
 *   (String) jid  - Jid to test for
 *
 * Returns:
 *   (Boolean)
 */
Candy.Core.ChatUser.prototype.isInPrivacyList = function (list, jid) {
  if (!this.data.privacyLists[list]) {
    return false;
  }
  return this.data.privacyLists[list].indexOf(jid) !== -1;
};

/** Function: setCustomData
 * Stores custom data
 *
 * Parameter:
 *   (Object) data - Object containing custom data
 */
Candy.Core.ChatUser.prototype.setCustomData = function (data) {
  this.data.customData = data;
};

/** Function: getCustomData
 * Retrieve custom data
 *
 * Returns:
 *   (Object) - Object containing custom data
 */
Candy.Core.ChatUser.prototype.getCustomData = function () {
  return this.data.customData;
};

/** Function: setPreviousNick
 * If user has nickname changed, set previous nickname.
 *
 * Parameters:
 *   (String) previousNick - the previous nickname
 */
Candy.Core.ChatUser.prototype.setPreviousNick = function (previousNick) {
  this.data.previousNick = previousNick;
};

/** Function: hasNicknameChanged
 * Gets the previous nickname if available.
 *
 * Returns:
 *   (String) - previous nickname
 */
Candy.Core.ChatUser.prototype.getPreviousNick = function () {
  return this.data.previousNick;
};

/** Function: getContact
 * Gets the contact matching this user from our roster
 *
 * Returns:
 *   (Candy.Core.Contact) - contact from roster
 */
Candy.Core.ChatUser.prototype.getContact = function () {
  return Candy.Core.getRoster().get(
    Strophe.getBareJidFromJid(this.data.realJid)
  );
};
