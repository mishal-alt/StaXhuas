import Joi from 'joi';

export const createScrumCallSchema = Joi.object({
  batch: Joi.string().hex().length(24).required(),
  date: Joi.date().iso().required(),
  agenda: Joi.string().required(),
  entries: Joi.array()
    .items(
      Joi.object({
        student: Joi.string().hex().length(24).required(),
        isPresent: Joi.boolean().required(),
        progressUpdate: Joi.string().allow('', null),
        blockers: Joi.string().allow('', null),
        actionItems: Joi.string().allow('', null),
      })
    )
    .min(1)
    .required(),
});
