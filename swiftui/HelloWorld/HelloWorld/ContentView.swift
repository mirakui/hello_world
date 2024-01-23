//
//  ContentView.swift
//  HelloWorld
//
//  Created by issei-naruta on 2023/06/30.
//

import SwiftUI
import UserNotifications

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text("Hello, world!")
            Button("Start", action: start)
        }
        .padding()
        .onAppear(perform: {
            self.requestNotificationPermission()
        })
    }

    func start() {
        print("hello!!")
        self.sendNotification()
    }

    func sendNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Notification Title"
        content.body = "Hello, World!"

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5, repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request) { (error) in
            if let error = error {
                print(error.localizedDescription)
            }
        }
    }

    func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted == true && error == nil {
                print("We have permission!")
            }
        }
    }

}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
