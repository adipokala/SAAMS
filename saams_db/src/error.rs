use warp::reject::Reject;
use std::fmt;

#[derive(Debug)]
pub struct CustomError {
    message: String,
}

impl CustomError {
    pub fn new(message: &str) -> Self {
        CustomError {
            message: message.to_string(),
        }
    }
}

impl Reject for CustomError {}