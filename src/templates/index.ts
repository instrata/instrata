export const TEMPLATE_MARKDOWN = `
# {{ title }}

{{ abstract }}

{% for step in steps %}
{{ step.pretext }}
![step.id]({{ step.screenshotPath }})
{{ step.posttext }}
{% endfor %}

{{ footnote }}
`.trimStart();
