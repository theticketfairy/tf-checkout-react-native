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
  static func moduleName() -> String {
    return "TFCheckoutRNModule"
  }
  
  @objc
  func constantsToExport() -> [AnyHashable : Any] {
    return ["count": 1]
  }
}
