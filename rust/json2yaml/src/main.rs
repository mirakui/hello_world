// use std::io;
// use std::fmt;

struct ObjectNode<'a> {
    key: String,
    value: &'a ValueNode,
}

trait ValueNode {
    fn to_json(&self) -> String;
}

impl<'a> ValueNode for ObjectNode<'a> {
    fn to_json(&self) -> String {
        format!("{{\"{}\": {}}}", self.key, self.value.to_json())
    }
}
impl<'a> ValueNode for String {
    fn to_json(&self) -> String {
        format!("\"{}\"", self)
    }
}

fn main() {
    let root: ObjectNode = ObjectNode {
        key: "foo".to_string(),
        value: &"bar".to_string(),
    };
    let obj: &ValueNode = &root;

    println!("{}", root.to_json());
    println!("{}", obj.to_json());
}
