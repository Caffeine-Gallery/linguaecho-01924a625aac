import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor {
  // Define a type for storing translation history
  type Translation = {
    original: Text;
    translated: Text;
    targetLanguage: Text;
  };

  // Store translation history
  stable var translations : [Translation] = [];

  // Add a new translation to the history
  public func addTranslation(original: Text, translated: Text, targetLanguage: Text) : async () {
    let newTranslation : Translation = {
      original = original;
      translated = translated;
      targetLanguage = targetLanguage;
    };
    translations := Array.append(translations, [newTranslation]);
  };

  // Get all translations
  public query func getTranslations() : async [Translation] {
    translations
  };

  // Clear translation history
  public func clearTranslations() : async () {
    translations := [];
  };
}
