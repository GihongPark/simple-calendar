# simple-calendar

## new Calendar(container, option)
| Name | Type | Description |
| --- | --- | --- |
| container | String | CSS 선택자. ex) "#calendar" |
| option | Object | 현재 schedule만 존재. |

<pre><code>
const option = {
  schedule : [
    {
      date : new Date()
    }
  ]
}
const calendar = new Calendar('.calendar-body',option);
</code></pre>
##
