import { isNumber } from "../../../utils/is-number"
import { MotionKeyframes } from "../../dom/types"
import {
  asTransformCssVar,
  buildTransformTemplate,
  isTransform,
  transformAlias,
  transformDefinitions,
} from "../../dom/utils/transforms"
import { MotionCSSProperties } from "../types"

export function convertKeyframesToStyles(
  keyframes?: MotionKeyframes
): MotionCSSProperties {
  const initialKeyframes: MotionCSSProperties = {}
  const transformKeys: string[] = []

  for (let key in keyframes) {
    const value = keyframes[key]
    if (isTransform(key)) {
      if (transformAlias[key]) key = transformAlias[key]
      transformKeys.push(key)
      key = asTransformCssVar(key)
    }

    let initialKeyframe = Array.isArray(value) ? value[0] : value

    /**
     * If this is a number and we have a default value type, convert the number
     * to this type.
     */
    const definition = transformDefinitions.get(key)
    if (definition) {
      initialKeyframe = isNumber(value)
        ? definition.toDefaultUnit!(value)
        : value
    }

    initialKeyframes[key] = initialKeyframe
  }

  if (transformKeys.length) {
    initialKeyframes.transform = buildTransformTemplate(transformKeys)
  }

  return initialKeyframes
}
