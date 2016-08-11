// use std::io;
// use std::fmt;
use std::collections::HashMap;

// struct ObjectNode<'a> {
//     key: String,
//     value: &'a ValueNode,
// }

type ObjectNode<'a> = HashMap<String, &'a ValueNode>;

trait ValueNode {
    fn to_json(&self) -> String;
}

impl<'a> ValueNode for ObjectNode<'a> {
    fn to_json(&self) -> String {
        self.iter()
            .map(|key, value| key)
            .collect()
            .connect(",")
    }
}
impl<'a> ValueNode for String {
    fn to_json(&self) -> String {
        format!("\"{}\"", self)
    }
}

fn main() {
    let mut obj: ObjectNode::new();
    obj.insert("key1", "value1".to_string());
    obj.insert("key2", "value2".to_string());

    println!("{}", obj.to_json());
}
