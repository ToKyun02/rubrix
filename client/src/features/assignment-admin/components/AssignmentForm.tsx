import { Button } from '@/atom-components/Button';
import { Listbox } from '@/atom-components/Listbox';
import { NumberStepper } from '@/atom-components/NumberStepper';
import { Card } from '@/composition-components/Card';
import { Field } from '@/composition-components/Field';
import {
  TIER_OPTIONS,
  TRACK_OPTIONS,
} from '@/features/assignment-admin/constants';
import { CreateAssignmentInputSchema } from '@/features/assignment-admin/hooks/types';
import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = CreateAssignmentInputSchema.extend({
  tags: z.string(),
});

export type AssignmentFormValues = z.infer<typeof FormSchema>;

interface SecondaryButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface AssignmentFormProps {
  heading: string;
  statusBadge?: ReactNode;
  defaultValues: AssignmentFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: AssignmentFormValues) => void;
  secondaryButton: SecondaryButton;
}

export function AssignmentForm({
  heading,
  statusBadge,
  defaultValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  secondaryButton,
}: AssignmentFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rubricItems',
  });

  const rubricItems = watch('rubricItems');
  const sum = rubricItems.reduce((a, r) => a + (r.points || 0), 0);
  const sumBad = sum !== 100;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5 flex items-center gap-2.5">
        <h1 className="text-heading text-xl font-extrabold">{heading}</h1>
        {statusBadge}
      </div>

      <div className="flex max-w-160 flex-col gap-4">
        <Field label="제목" error={errors.title?.message}>
          <input
            {...register('title')}
            className={cn(
              'bg-card border-border text-text w-full rounded-md border px-3 py-2 text-sm',
              errors.title && 'border-red',
            )}
          />
        </Field>

        <div className="flex gap-3">
          <Field label="티어" className="flex-1">
            <Controller
              control={control}
              name="tier"
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  options={TIER_OPTIONS}
                />
              )}
            />
          </Field>
          <Field label="트랙" className="flex-1">
            <Controller
              control={control}
              name="track"
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  options={TRACK_OPTIONS}
                />
              )}
            />
          </Field>
          <Field
            label="예상 소요(시간)"
            className="w-32"
            error={errors.hoursEstimate?.message}
          >
            <Controller
              control={control}
              name="hoursEstimate"
              render={({ field }) => (
                <NumberStepper
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                  step={1}
                  className={errors.hoursEstimate ? 'border-red' : undefined}
                />
              )}
            />
          </Field>
        </div>

        <Field label="태그 (쉼표로 구분)">
          <input
            {...register('tags')}
            placeholder="react, typescript"
            className="bg-card border-border text-text w-full rounded-md border px-3 py-2 text-sm"
          />
        </Field>

        <Field
          label="요구사항 (Markdown)"
          error={errors.requirementsMd?.message}
        >
          <textarea
            {...register('requirementsMd')}
            rows={6}
            className={cn(
              'bg-card border-border text-text w-full resize-none rounded-md border px-3 py-2 text-sm',
              errors.requirementsMd && 'border-red',
            )}
          />
        </Field>

        <div>
          <div className="mb-2.5 flex items-baseline gap-2.5">
            <div className="text-heading text-sm font-extrabold">
              루브릭 항목
            </div>
            <div
              className={`ml-auto text-xs font-extrabold ${sumBad ? 'text-red' : 'text-green'}`}
            >
              합계 {sum}/100
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {fields.map((field, i) => (
              <Card
                key={field.id}
                className="flex flex-col gap-2 rounded-lg px-3.5 py-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    {...register(`rubricItems.${i}.name`)}
                    placeholder="항목명"
                    className="border-border text-text flex-1 rounded-md border px-3 py-1.5 text-[13px]"
                  />
                  <Controller
                    control={control}
                    name={`rubricItems.${i}.points`}
                    render={({ field: pointsField }) => (
                      <NumberStepper
                        value={pointsField.value}
                        onChange={pointsField.onChange}
                        min={0}
                        step={5}
                        className="w-28"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    disabled={fields.length === 1}
                    className="text-red disabled:text-muted-2 cursor-pointer px-2 text-xs font-bold"
                  >
                    삭제
                  </button>
                </div>
                <textarea
                  {...register(`rubricItems.${i}.aiGuide`)}
                  placeholder="AI 채점 지침"
                  rows={2}
                  className="border-border text-text resize-none rounded-md border px-3 py-1.5 text-[12.5px]"
                />
              </Card>
            ))}
          </div>

          {sumBad && (
            <div className="bg-red/8 border-red/35 text-red mt-3 rounded-lg border px-3.5 py-2.5 text-[12.5px] font-semibold">
              배점 합계가 100이 아니면 저장할 수 없습니다
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2.5 border-dashed text-muted"
            onClick={() => append({ name: '', points: 0, aiGuide: '' })}
          >
            <Plus size="16" />
            루브릭 항목 추가
          </Button>
        </div>

        <div className="mt-2 flex gap-2.5">
          <Button type="submit" variant="primary" disabled={sumBad || isSubmitting}>
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={secondaryButton.disabled}
            onClick={secondaryButton.onClick}
          >
            {secondaryButton.label}
          </Button>
        </div>
      </div>
    </form>
  );
}
