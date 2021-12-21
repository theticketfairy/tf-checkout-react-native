//
//  TFCheckoutRNModule.swift
//  TFCheckoutRNModule
//
//  Copyright © 2021 TheTicketFairy. All rights reserved.
//

import Foundation

@objc(TFCheckoutRNModule)
class TFCheckoutRNModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
