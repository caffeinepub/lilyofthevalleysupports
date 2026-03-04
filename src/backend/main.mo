import Array "mo:core/Array";
import Order "mo:core/Order";
import List "mo:core/List";

actor {
  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  module ContactSubmission {
    public func compare(sub1 : ContactSubmission, sub2 : ContactSubmission) : Order.Order {
      sub1.name.compare(sub2.name);
    };
  };

  let submissions = List.empty<ContactSubmission>();

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let submission : ContactSubmission = {
      name;
      email;
      message;
    };
    submissions.add(submission);
  };

  public query ({ caller }) func getAllSubmissions() : async [ContactSubmission] {
    submissions.toArray().sort(); // Implicitly uses ContactSubmission.compare to sort by name
  };
};
