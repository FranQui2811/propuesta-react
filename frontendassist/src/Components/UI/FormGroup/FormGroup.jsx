import React from 'react'

export const FormGroup = ({place, inputType,contLabel, nameInput, onChange, value, min, id, accept, maxLenght, onFocus, minLength}) => {
  return (
    <div className='form__group field'>
        {/* placeholder=" " permite usar :placeholder-shown para detectar si el input está vacío */}
        <input
            id={id}
            name={nameInput}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            type={inputType}
            className='form__field'
            placeholder=" "
            maxLength={maxLenght}
            minLength={minLength}
            min={min}
            accept={accept}
            required
        />
        <label className='form__label'>{contLabel}</label>
    </div>
  )
}
